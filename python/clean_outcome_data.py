import pandas as pd

cols_to_keep = []
races = ['white', 'black', 'hisp', 'asian', 'natam', 'other']
genders = ['pooled', 'male', 'female']
pctiles = ['p1', 'p25', 'p50', 'p75', 'p100']
# outcomes = ['kfr', 'kfr_top01', 'kfr_top20', 'kir', 'kir_top01', 'kir_top20']
outcomes = ['kir']
# outcomes = ['kir_top20']
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
cols_to_keep = ['state', 'county'] + get_column_names(outcomes, races, genders, pctiles)
df = pd.read_csv("data/county_outcomes.csv", usecols=cols_to_keep, dtype={'state': 'object', 'county': 'object'})
df['code'] = df['state'] + df['county']
for i in range(df.shape[0]):
    df['code'][i] = "0" * (2 - len(df['state'][i])) + df['state'][i] + "0" * (3 - len(df['county'][i])) + df['county'][i]
df = df.drop(['state', 'county'], axis=1)
df = df.set_index('code')
df = df.loc[~df.index.duplicated(keep='first')]
# df.apply(lambda x: [x.dropna()], axis=0).to_json("data/kir_county3.json", orient="columns")
df.to_json("data/kir_county.json")
