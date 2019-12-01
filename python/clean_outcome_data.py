import pandas as pd

chunksize = 10
cols_to_keep = []
races = ['white', 'black', 'hisp', 'asian', 'natam', 'other']
genders = ['pooled', 'male', 'female']
pctiles = ['p1', 'p25', 'p50', 'p75', 'p100']
# outcomes = ['kfr', 'kfr_top01', 'kfr_top20', 'kir', 'kir_top01', 'kir_top20']
outcomes = ['kir']
# education_outcomes = ['coll', 'comcoll', 'grad']
# incarceration_outcomes = ['jail']
# outcomes.append(education_outcomes).append(incarceration_outcomes)

def get_column_names(outcomes, races, genders, pctiles):
    col_names = []
    for outcome in outcomes:
        for race in races:
            for gender in genders:
                for pctile in pctiles:
                    col_names.append(outcome + '_' + race + '_' + gender + '_' + pctile)
    return col_names
cols_to_keep = ['tract'] + get_column_names(outcomes, races, genders, pctiles)
print(cols_to_keep)
first = True
df = pd.read_csv("data/tract_outcomes_early.csv", index_col='tract', usecols=cols_to_keep, dtype={'tract': 'object'})
print("done reading")
df = df.loc[~df.index.duplicated(keep='first')]
print("done getting dupes")
df.to_json("data/kir.json", orient='index')
# for chunk in pd.read_csv("data/tract_outcomes_early.csv", index_col='tract', chunksize=chunksize, usecols=cols_to_keep, dtype={'tract': 'object'}):
# #     chunk.to_csv("data/cleaned_outcomes_kir_only.csv", mode='a', header=first, index=False)
#     print(chunk)
#     chunk.to_json(orient='index')
#     first = False
#     print(chunk.columns)