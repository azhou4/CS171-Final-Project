import pandas as pd
"""
Script to clean All Outcomes by County, Race, Gender and Parental Income Percentile dataset from Opportunity Insights
https://opportunityinsights.org/data/
"""

cols_to_keep = []
# Select relevant factors of interest
races = ['white', 'black', 'hisp', 'asian', 'natam', 'other']
genders = ['pooled', 'male', 'female']
pctiles = ['p1', 'p25', 'p50', 'p75', 'p100']
# Select outcomes of interest
outcomes = ['kir_top20']

def get_column_names(outcomes, races, genders, pctiles):
    """ Generate column names for outcomes and factors selected"""
    col_names = []
    for outcome in outcomes:
        for race in races:
            for gender in genders:
                for pctile in pctiles:
                    col_names.append(outcome + '_' + race + '_' + gender + '_' + pctile)
    return col_names

cols_to_keep = ['state', 'county'] + get_column_names(outcomes, races, genders, pctiles)
df = pd.read_csv("data/county_outcomes.csv", usecols=cols_to_keep, dtype={'state': 'object', 'county': 'object'})

# Create json indexed by column names, then county codes
df['code'] = df['state'] + df['county']
for i in range(df.shape[0]):
    df['code'][i] = "0" * (2 - len(df['state'][i])) + df['state'][i] + "0" * (3 - len(df['county'][i])) + df['county'][i]
df = df.drop(['state', 'county'], axis=1)
df = df.set_index('code')
df = df.loc[~df.index.duplicated(keep='first')]
df = df.clip(0,1)
df.to_json("data/jail_county.json")
