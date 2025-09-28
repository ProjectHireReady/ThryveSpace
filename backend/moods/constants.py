# Category Choices (value, label) - Used in the Mood model's category field
CATEGORY_CHOICES = [
    ("very negative", "Very Negative"),
    ("negative", "Negative"),
    ("neutral", "Neutral"),
    ("positive", "Positive"),
    ("very positive", "Very Positive"),
]

# Cloudinary Icon Mapping (value: icon_url) - Used by serializers/APIs
CATEGORY_ICONS = {
    "positive": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757663590/Positive_yaegjw.svg",
    "very positive": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757664397/Very_Positive_grjod4.svg",
    "neutral": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757617744/Neutral_j2n5gp.svg",
    "negative": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757615267/Sad_vlwdhy.svg",
    "very negative": "https://res.cloudinary.com/dirn4gqky/image/upload/v1757660403/Lonely_bfgeld.svg",
}