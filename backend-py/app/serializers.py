"""Serializers that emit Node-compatible JSON shapes.

The frontend expects MongoDB/Mongoose-style camelCase fields and `_id` instead
of `id`. These functions turn SQLAlchemy models into that exact shape so the
frontend ships zero changes.
"""
from app.models.animal import Animal
from app.models.user import User


def serialize_user(u: User) -> dict:
    return {
        "_id": str(u.id),
        "phone": u.phone,
        "name": u.name,
        "location": u.location,
        "createdAt": u.created_at.isoformat(),
        "updatedAt": u.updated_at.isoformat(),
    }


def serialize_user_compact(u: User) -> dict:
    """The subset returned in /verify-otp response, matching Node exactly."""
    return {
        "_id": str(u.id),
        "phone": u.phone,
        "name": u.name,
        "location": u.location,
    }


def serialize_animal(a: Animal) -> dict:
    return {
        "_id": str(a.id),
        "type": a.type,
        "images": a.images or [],
        "price": a.price,
        "age": a.age,
        "ageUnit": a.age_unit,
        "location": a.location,
        "breed": a.breed,
        "calving": a.calving,
        "milkPerDay": a.milk_per_day,
        "description": a.description,
        "sellerId": str(a.seller_id),
        "sellerPhone": a.seller_phone,
        "sellerName": a.seller_name,
        "isActive": a.is_active,
        "createdAt": a.created_at.isoformat(),
        "updatedAt": a.updated_at.isoformat(),
    }
