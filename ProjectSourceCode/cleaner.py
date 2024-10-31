import pandas as pd
import itertools as it
import numpy as np
import matplotlib
from matplotlib import pyplot  as plt

class Cleaner:
    def __init__(self, data):
        self.df = pd.read_csv(data)
        
        # #clean must return a Pandas DF
        # self.dfClean = self.clean(self.df)
        
        # rows, cols = self.dfClean.shape
        
        # #imagining a screen of feedback after cleaning on front end, between insert and choices pages
        # print("Your clean data has",rows,"entries, and", cols, "parameters")
        # print("First few entries of your clean data...") #want this to be a dropdown on front end
        # print(self.dfClean.head())
        # return self.dfClean
    
    #to remove duplicate entries
    #sounds good, because the data set is global we can jus do it like this

    def get_head(self):
        return self.df.head()

    def remove_duplicates(self):
        self.df = df.drop_duplicates(inplace = True)
    
    #to remove NA rows and cols
    def remove_na(self):
        self.df = self.df.dropna(inplace = True)
    
    def get_data_types(self):
        return [self.df.dtypes]
    
    def convert_time(self, data):
        for col in data.columns:
            lower = col.lower()
            if "time" in col:
                data[col] = data[col].dt.strftime('%H:%M:%S %p')
                
        return data
    
    def normalize_data(self):
        #ToDo
        pass
    
    def get_structure(self):
        #ToDo
        pass
    
    def get_sample(self):
        #ToDo
        pass
    
    #@DELETEWHENSEEN the time complexity of this is gonna be shit but I just cant think of a better way 
    def get_granularity(self):
        num_rows = self.df.shape[0]
        all_cols = [col for col in self.df]
        primary_keys = []

        for col in all_cols:  
            if self.df[col].nunique() == num_rows:
                primary_keys.append(col)
                return primary_keys

        for i in range(2, len(all_cols) + 1):
            for subset in it.combinations(all_cols, i):
                subset_as_list = [*subset]
                if self.df[subset_as_list].drop_duplicates().shape[0] == num_rows:
                    return subset_as_list

        return primary_keys if primary_keys else None


    def clean(self, data):
        data2 = self.remove_duplicates(data)
        return data2
        #ToDo
        pass
    
    def clean(self, df):
        dataDups = self.remove_duplicates(df)
        dataTime = self.convert_time(dataDups)
        return dataTime
        
