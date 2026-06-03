"""Categorías canónicas del catálogo.

Para sumar categorías nuevas, agregar una fila con id, name y slug.
Mantener los IDs estables evita romper productos ya cargados.
"""

PERFUME_CATEGORY_DEFINITIONS = [
    {"id": 1, "name": "Masculinos", "slug": "masculinos", "description": "Perfumes masculinos"},
    {"id": 2, "name": "Femeninos", "slug": "femeninos", "description": "Perfumes femeninos"},
    {"id": 3, "name": "Unisex", "slug": "unisex", "description": "Perfumes unisex"},
    {"id": 4, "name": "Perfumes de Cartera", "slug": "perfumes-de-cartera", "description": "Perfumes de cartera"},
]

CATEGORY_ID_TO_NAME = {
    category["id"]: category["name"]
    for category in PERFUME_CATEGORY_DEFINITIONS
}

DEFAULT_CATEGORY_ID = 1
