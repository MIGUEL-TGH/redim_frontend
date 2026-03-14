import pandas as pd

# =========================
# 1. LEER ARCHIVOS
# =========================

data = pd.read_excel("2.-template.xlsx")
# years = pd.read_excel("3.-tables_db.xlsx", sheet_name="YEARS")
years = pd.read_excel("3.-tables_db.xlsx", sheet_name="YEARS")[["id","name"]]
states = pd.read_excel("3.-tables_db.xlsx", sheet_name="ESTADOS")[["id","name"]]
genders = pd.read_excel("3.-tables_db.xlsx", sheet_name="GENDERS")[["id","name"]]
categories = pd.read_excel("3.-tables_db.xlsx", sheet_name="CATEGORIES")[["id","name","level"]]

# =========================
# 2. LIMPIAR COLUMNAS
# =========================

data = data[["year","population","crime","gender","state","value"]]

population_map = {
    "Delitos": "PS",
    "Delitos de personas en Centros penitenciarios": "PI"
}

data["population"] = data["population"].map(population_map)

data = data[data["population"].isin(["PI","PS"])]


# =========================
# 3. CREAR PIVOT
# =========================

pivot = data.pivot_table(
    index=["year","crime","gender","state"],
    columns="population",
    values="value",
    aggfunc="sum"
).reset_index()

# pivot = pivot.fillna(0)
pivot = pivot.fillna(0)

# asegurar que existan ambas columnas
if "PI" not in pivot.columns:
    pivot["PI"] = 0

if "PS" not in pivot.columns:
    pivot["PS"] = 0

# =========================
# 4. UNIR CATÁLOGOS
# =========================

pivot = pivot.merge(years, left_on="year", right_on="name")
pivot = pivot.rename(columns={"id":"year_id"}).drop(columns=["name"])

pivot = pivot.merge(genders, left_on="gender", right_on="name")
pivot = pivot.rename(columns={"id":"gender_id"}).drop(columns=["name"])

pivot = pivot.merge(states, left_on="state", right_on="name")
pivot = pivot.rename(columns={"id":"state_id"}).drop(columns=["name"])

pivot = pivot.merge(categories, left_on="crime", right_on="name")
# pivot = pivot.rename(columns={"id":"category_id"}).drop(columns=["name"])
pivot = pivot.rename(columns={"id":"category_id","level":"level"}).drop(columns=["name"])

# =========================
# 5. ORDENAR
# =========================

gender_order = {
    "Mujer": 1,
    "Hombre": 2
}

pivot["gender_order"] = pivot["gender"].map(gender_order)

pivot = pivot.sort_values(
    by=["year_id","gender_order","state_id"]
)

pivot = pivot.drop(columns=["gender_order"])

# =========================
# 6. PREPARAR VALUES
# =========================

pivot["PI"] = pivot["PI"].astype(int)
pivot["PS"] = pivot["PS"].astype(int)

pivot["values_sql"] = (
    "("
    + pivot["category_id"].astype(str) + ", "
    + pivot["year_id"].astype(str) + ", "
    + pivot["gender_id"].astype(str) + ", "
    + "NULL, "
    + pivot["state_id"].astype(str) + ", "
    + pivot["PI"].astype(str) + ", "
    + pivot["PS"].astype(str) + ", "
    + "1)"
)

values_list = pivot["values_sql"].tolist()

# =========================
# 7. GENERAR INSERT MASIVO
# =========================

chunk_size = 64

sql_blocks = []

for i in range(0, len(values_list), chunk_size):

    chunk = values_list[i:i+chunk_size]

    sql = (
        "INSERT INTO indicator_category_details "
        "(category_id, year_id, gender_id, center_id, state_id, PI, PS, status) VALUES\n"
        + ",\n".join(chunk)
        + ";\n"
    )

    sql_blocks.append(sql)

# =========================
# 8. GUARDAR ARCHIVO
# =========================

first_category = pivot.iloc[0]

# level = str(first_category["level"]).strip()
level = "" if pd.isna(first_category["level"]) else str(first_category["level"]).strip()
name = str(first_category["crime"]).strip()

# tomar máximo 4 palabras
words = name.split()[:4]
short_name = " ".join(words)

filename = f"{level} {short_name}.sql"

with open(filename,"w",encoding="utf8") as f:
    f.write("\n".join(sql_blocks))

# with open("output.sql","w",encoding="utf8") as f:
#     f.write("\n".join(sql_blocks))

# message = f"--> SQL generado correctamente: {name}"
# message = f"--> SQL generado correctamente: {filename}"
message = "--> SQL generado correctamente"
print(message)

# =========================
