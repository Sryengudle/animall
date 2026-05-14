"""Animal endpoints — mirror /api/animals/* from the Node backend exactly."""
import uuid
from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from sqlalchemy import func, select

from app.deps import CurrentUserDep, SessionDep
from app.models.animal import AGE_UNITS, ANIMAL_TYPES, Animal
from app.serializers import serialize_animal
from app.services.storage import save_image

router = APIRouter(tags=["animals"])


def _parse_uuid(s: str) -> uuid.UUID | None:
    try:
        return uuid.UUID(s)
    except (ValueError, TypeError):
        return None


@router.get("")
async def list_animals(
    db: SessionDep,
    type: str | None = None,
    minPrice: int | None = None,  # noqa: N803 — match Node API casing
    maxPrice: int | None = None,  # noqa: N803
    page: int = 1,
    limit: int = 20,
) -> dict:
    page = max(1, page)
    limit = max(1, min(limit, 100))

    conditions = [Animal.is_active.is_(True)]
    if type and type != "all":
        conditions.append(Animal.type == type)
    if minPrice is not None:
        conditions.append(Animal.price >= minPrice)
    if maxPrice is not None:
        conditions.append(Animal.price <= maxPrice)

    base = select(Animal).where(*conditions)

    count_result = await db.execute(select(func.count()).select_from(base.subquery()))
    total: int = int(count_result.scalar() or 0)

    page_q = base.order_by(Animal.created_at.desc()).offset((page - 1) * limit).limit(limit)
    result = await db.execute(page_q)
    animals = result.scalars().all()

    return {
        "animals": [serialize_animal(a) for a in animals],
        "total": total,
        "page": page,
        "pages": (total + limit - 1) // limit if total else 0,
    }


# IMPORTANT: must be declared BEFORE /{animal_id} so /my/listings isn't matched as an id.
@router.get("/my/listings")
async def my_listings(user: CurrentUserDep, db: SessionDep) -> list[dict]:
    result = await db.execute(
        select(Animal).where(Animal.seller_id == user.id).order_by(Animal.created_at.desc())
    )
    return [serialize_animal(a) for a in result.scalars().all()]


@router.get("/{animal_id}")
async def get_animal(animal_id: str, db: SessionDep) -> dict:
    uid = _parse_uuid(animal_id)
    if uid is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    animal = await db.get(Animal, uid)
    if animal is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    return serialize_animal(animal)


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_animal(
    user: CurrentUserDep,
    db: SessionDep,
    type: Annotated[str, Form()],
    price: Annotated[int, Form()],
    location: Annotated[str, Form()],
    age: Annotated[int, Form()] = 2,
    ageUnit: Annotated[str, Form()] = "years",  # noqa: N803
    description: Annotated[str, Form()] = "",
    breed: Annotated[str, Form()] = "",
    calving: Annotated[str, Form()] = "",
    milkPerDay: Annotated[str, Form()] = "",  # noqa: N803
    images: list[UploadFile] = File(default=[]),
) -> dict:
    if type not in ANIMAL_TYPES:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Invalid type: {type}")
    if ageUnit not in AGE_UNITS:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Invalid ageUnit: {ageUnit}")

    image_paths: list[str] = []
    for img in images[:5]:
        if not img.filename:
            continue
        image_paths.append(await save_image(img))

    animal = Animal(
        type=type,
        images=image_paths,
        price=price,
        age=age or 2,
        age_unit=ageUnit,
        location=location,
        description=description,
        breed=breed,
        calving=calving,
        milk_per_day=milkPerDay,
        seller_id=user.id,
        seller_phone=user.phone,
        seller_name=user.name,
    )
    db.add(animal)
    await db.commit()
    await db.refresh(animal)
    return serialize_animal(animal)


@router.delete("/{animal_id}")
async def delete_animal(animal_id: str, user: CurrentUserDep, db: SessionDep) -> dict:
    uid = _parse_uuid(animal_id)
    if uid is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")

    animal = await db.get(Animal, uid)
    if animal is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")
    if animal.seller_id != user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not authorized")

    animal.is_active = False
    await db.commit()
    return {"message": "Listing removed"}
