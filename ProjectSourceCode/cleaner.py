import pandas as pd
import numpy as np
import matplotlib
from matplotlib import pyplot  as plt


class Cleaner:
    def __init__(self, data):
        self.df = pd.read_csv(data)
        
        #clean must return a Pandas DF
        self.dfClean = self.clean(self.df)
        
        rows, cols = self.dfClean.shape
        
        #imagining a screen of feedback after cleaning on front end, between insert and choices pages
        print("Your clean data has",rows,"entries, and", cols, "parameters")
        print("First few entries of your clean data...") #want this to be a dropdown on front end
        print(self.dfClean.head())
        return self.dfClean
    
    #to remove duplicate entries
    #@DELETE ME WHEN SEEN made this seperate from NA incase the data SHOULD have duplicates
    def remove_duplicates(self, data):
        data.drop_duplicates(inplace = True)
        return data
    
    #to remove NA rows and cols
    def remove_na(self):
        pass
    
    def get_data_types(self):
        #ToDo
        pass
    
    def convert_time(self):
        #ToDo
        pass
    
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
    
    def clean(self, data):
        data2 = self.remove_duplicates(data)
        return data2
        
