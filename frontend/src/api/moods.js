import axios from "../lib/axiosInstance";

// Hardcoded fallback moods (20)
export const fallbackMoods = [
  { id: 1, name: "Warm", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757589715/Warm_ospuu6.svg" },
  { id: 2, name: "Annoyed", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757615436/Annoyed_hmbpkc.svg" },
  { id: 3, name: "Sad", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757615267/Sad_vlwdhy.svg" },
  { id: 4, name: "Playful", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757616036/Playful_p18t2u.svg" },
  { id: 5, name: "Neutral", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757617744/Neutral_j2n5gp.svg" },
  { id: 6, name: "Irritated", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757622539/Irritated_ybgvkv.svg" },
  { id: 7, name: "Nervous", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757623110/Nervous_m9tm4q.svg" },
  { id: 8, name: "Helpless", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757624218/Helpless_rmwyq8.svg" },
  { id: 9, name: "Hurt", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757661463/Hurt_ibzurx.svg" },
  { id: 10, name: "Happy", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757659647/Happy_km0lhv.svg" },
  { id: 11, name: "Frustrated", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757589705/Frustated_xagicj.svg" },
  { id: 12, name: "Excited", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757589704/Excited_tgka5f.svg" },
  { id: 13, name: "Lonely", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757660403/Lonely_bfgeld.svg" },
  { id: 14, name: "Disbelief", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757589703/Disbelief_cofhzn.svg" },
  { id: 15, name: "Angry", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757661818/Angry_xfltel.svg" },
  { id: 16, name: "Confused", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757589702/Confused_vlone7.svg" },
  { id: 17, name: "Embarassed", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757589702/Concerned_vofqgv.svg" },
  { id: 18, name: "Dissapointed", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757589702/Disappointed_mhmhbm.svg" },
  { id: 19, name: "Relieved", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757660828/Relieved_m34pow.svg" },
  { id: 20, name: "Sick", imageUrl: "https://res.cloudinary.com/dirn4gqky/image/upload/v1757662446/Sick_dxzthr.svg" },
];

// Enhanced API call with fallback
export const getMoods = async () => {
  try {
    const res = await axios.get("/moods/");
    if (res.data && res.data.length > 0) {
      return res.data; // API moods
    }
    return fallbackMoods; // fallback if API returns empty
  } catch (error) {
    console.error("Failed to fetch moods from API, using fallback.", error);
    return fallbackMoods;
  }
};
