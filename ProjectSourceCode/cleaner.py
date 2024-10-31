import pandas as pd
import numpy as np
import matplotlib
from matplotlib import pyplot  as plt

class Cleaner:
    def __init__(self, dataframe):        
        #clean must return a Pandas DF
        self.df = dataframe
        self.data = self.clean(self.df)
        
        rows, cols = self.data.shape
        
        #imagining a screen of feedback after cleaning on front end, between insert and choices pages
        print("Your clean data has",rows,"entries, and", cols, "parameters")
        print("First few entries of your clean data...") #want this to be a dropdown on front end
        print(self.data.head())
    
    #to remove duplicate entries
    def remove_duplicates(self, df):
        df.drop_duplicates(inplace = True)
        return df
    
    #to remove NA rows
    def remove_na(self, df):
        df.dropna(inplace = True)
        return df
    
    def get_data_types(self):
        #ToDo
        pass
    
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
    
    def get_granularity(self):
        #ToDo
        pass
    
    def clean(self, df):
        dataDups = self.remove_duplicates(df)
        dataTime = self.convert_time(dataDups)
        return dataTime
        
