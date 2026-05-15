import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import { ANIMAL_META } from '@/constants/animals';

// Re-export for compatibility — some legacy imports may still reference it here.
export { ANIMAL_META };

// Dummy seed data — breed/calving are translation KEYS, not display strings.
// This lets us render them correctly in en/hi/mr without bespoke string parsing.
const DUMMY_ANIMALS = [
  {
    _id: 'a1', type: 'cow', emoji: '🐄', price: 40000,
    breed: 'jersey_cross', calving: 'first', milkPerDay: '3',
    age: 3, ageUnit: 'years',
    location: 'Pune, Maharashtra',
    sellerName: 'Ramu Shet', sellerPhone: '9876543210',
    description: 'Healthy first-calving Jersey cross.',
    images: [], createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    _id: 'a2', type: 'cow', emoji: '🐄', price: 25000,
    breed: 'jersey_cross', calving: 'none', milkPerDay: '',
    age: 2, ageUnit: 'years',
    location: 'Nashik, Maharashtra',
    sellerName: 'Sanjay Patil', sellerPhone: '9765432109',
    description: 'Young cow, not yet calved.',
    images: [], createdAt: new Date(Date.now() - 10 * 3600000).toISOString(),
  },
  {
    _id: 'a3', type: 'buffalo', emoji: '🐃', price: 65000,
    breed: 'murrah', calving: 'second', milkPerDay: '12',
    age: 4, ageUnit: 'years',
    location: 'Nashik, Maharashtra',
    sellerName: 'Arjun More', sellerPhone: '9654321098',
    description: 'Murrah buffalo, second calving, 12L/day.',
    images: [], createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    _id: 'a4', type: 'buffalo', emoji: '🐃', price: 85000,
    breed: 'mehsana', calving: 'third', milkPerDay: '18',
    age: 5, ageUnit: 'years',
    location: 'Satara, Maharashtra',
    sellerName: 'Balu Jadhav', sellerPhone: '9543210987',
    description: 'Mehsana buffalo, third calving, 18L/day.',
    images: [], createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    _id: 'a5', type: 'goat', emoji: '🐐', price: 8000,
    breed: 'osmanabadi', calving: 'first', milkPerDay: '2',
    age: 1, ageUnit: 'years',
    location: 'Kolhapur, Maharashtra',
    sellerName: 'Mahadev Kadam', sellerPhone: '9432109876',
    description: 'Osmanabadi goat, first calving.',
    images: [], createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
  },
  {
    _id: 'a6', type: 'chicken', emoji: '🐓', price: 350,
    breed: 'desi', calving: '', milkPerDay: '',
    age: 6, ageUnit: 'months',
    location: 'Solapur, Maharashtra',
    sellerName: 'Vinod Sawant', sellerPhone: '9321098765',
    description: 'Healthy desi chicken.',
    images: [], createdAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    _id: 'a7', type: 'sheep', emoji: '🐑', price: 12000,
    breed: 'deccani', calving: '', milkPerDay: '',
    age: 2, ageUnit: 'years',
    location: 'Ahmednagar, Maharashtra',
    sellerName: 'Ravi Shinde', sellerPhone: '9210987654',
    description: 'Healthy Deccani sheep.',
    images: [], createdAt: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
  {
    _id: 'a8', type: 'goat', emoji: '🐐', price: 15000,
    breed: 'sangamneri', calving: 'second', milkPerDay: '3',
    age: 2, ageUnit: 'years',
    location: 'Latur, Maharashtra',
    sellerName: 'Suresh Pawar', sellerPhone: '9109876543',
    description: 'Sangamneri goat, second calving.',
    images: [], createdAt: new Date(Date.now() - 96 * 3600000).toISOString(),
  },
];

// ── Async thunks

export const fetchAnimals = createAsyncThunk(
  'animals/fetch',
  async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await api.get(`/animals?${query}`);
      localStorage.setItem('animall_cached_animals', JSON.stringify(res.data.animals));
      return res.data.animals;
    } catch {
      const cached = localStorage.getItem('animall_cached_animals');
      return cached ? JSON.parse(cached) : DUMMY_ANIMALS;
    }
  }
);

export const fetchMyListings = createAsyncThunk(
  'animals/myListings',
  async (_, { getState }) => {
    const { auth } = getState();
    try {
      const res = await api.get('/animals/my/listings', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return res.data;
    } catch {
      return DUMMY_ANIMALS.filter((a) => a.sellerPhone === auth.user?.phone);
    }
  }
);

export const addAnimal = createAsyncThunk(
  'animals/add',
  async ({ formData, token }) => {
    try {
      const res = await api.post('/animals', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch {
      const obj = Object.fromEntries(formData.entries());
      // Collect images: FormData allows multiple entries with the same key.
      const imageEntries = formData.getAll('images');
      const imagePreviews = await Promise.all(
        imageEntries.map((file) =>
          new Promise((resolve) => {
            if (!(file instanceof Blob)) return resolve(null);
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
        )
      );
      return {
        _id: `local_${Date.now()}`,
        ...obj,
        price: Number(obj.price) || 0,
        images: imagePreviews.filter(Boolean),
        emoji: ANIMAL_META[obj.type]?.emoji || '🐾',
        createdAt: new Date().toISOString(),
      };
    }
  }
);

export const deleteAnimal = createAsyncThunk(
  'animals/delete',
  async ({ id, token }) => {
    try {
      await api.delete(`/animals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch { /* offline */ }
    return id;
  }
);

/**
 * Report a listing for moderator review. Buyer-side action — backend rejects
 * if the reporter is the seller, and dedupes if they've already reported.
 */
export const reportAnimal = createAsyncThunk(
  'animals/report',
  async ({ id, reason, details, token }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/animals/${id}/report`, { reason, details }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Report failed');
    }
  },
);

/**
 * Edit an existing listing. Multipart body so the owner can also upload new
 * images/videos. Pass mode='replace' to swap all media; default appends.
 */
export const updateAnimal = createAsyncThunk(
  'animals/update',
  async ({ id, formData, token, mode = 'append' }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/animals/${id}?mode=${mode}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Update failed');
    }
  }
);

// ── Slice

const animalsSlice = createSlice({
  name: 'animals',
  initialState: {
    list: DUMMY_ANIMALS,
    myListings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimals.pending,   (state) => { state.loading = true; })
      .addCase(fetchAnimals.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAnimals.rejected,  (state) => { state.loading = false; })

      .addCase(fetchMyListings.fulfilled, (state, action) => {
        state.myListings = action.payload;
      })

      .addCase(addAnimal.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.myListings.unshift(action.payload);
      })

      .addCase(deleteAnimal.fulfilled, (state, action) => {
        const id = action.payload;
        state.list = state.list.filter((a) => a._id !== id);
        state.myListings = state.myListings.filter((a) => a._id !== id);
      })

      .addCase(updateAnimal.fulfilled, (state, action) => {
        const updated = action.payload;
        const merge = (arr) => arr.map((a) => (a._id === updated._id ? updated : a));
        state.list = merge(state.list);
        state.myListings = merge(state.myListings);
      });
  },
});

export default animalsSlice.reducer;
