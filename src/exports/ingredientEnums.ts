export enum Quality {
    Aroma = 'Aroma',
    Sweetness = 'Sweetness',
    Tanginess = 'Tanginess',
    Bitterness = 'Bitterness',
    Spiciness = 'Spiciness',
    Umami = 'Umami',
    Toughness = 'Toughness',
    Softness = 'Softness',
    Presentation = 'Presentation',
    // TODO: greasiness? addictiveness? horniness? persausiveness?
}

export enum QualityRating {
    ExtremelyNegative = -3,
    VeryNegative = -2,
    Negative = -1,
    Neutral = 0,
    Positive = 1,
    VeryPositive = 2,
    ExtremelyPositive = 3,
}

export enum IngredientType {
    Cheese,
    Patty,
    Sauce,
    Bun,
    Vegetable,
}