import pandas as pd
import itertools as it
import numpy as np
import matplotlib
from matplotlib import pyplot  as plt
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import OneHotEncoder

class Cleaner:
    def __init__(self, data):
        self.df = pd.read_csv(data)
        
    def get_df(self):
        return self.df

    #return the head of the data (5 lines)
    def get_head(self):
        return self.df.head()
    
    #remove duplicate entries in the data
    def remove_duplicates(self):
        self.df.drop_duplicates(inplace = True)
        return self.df
    
    #to remove NA rows and cols
    def remove_na(self):
        self.df.dropna(inplace = True)
        return self.df
    
    #return data types of dataframe
    def get_data_types(self):
        return [self.df.dtypes]
    
    #convert any time with "time" in column name to standard form
    def convert_time(self):
        for col in self.df.columns:
            lower = col.lower()
            print(lower)
            if "time" in lower:
                self.df[col] = self.df[col].dt.strftime('%H:%M:%S %p')        
        return self.df
    
    def row(self, num):
        return self.df.loc[num,:]
    
    #convert any date with "date" in column name to standard form
    def convert_date(self):
        for col in self.df.columns:
            lower = col.lower()
            if ("date" in lower or "dt" in lower):
                self.df[col] = pd.to_datetime(self.df[col])     
        return self.df
    
    def normalize_data(self):
        for col in self.df.columns:
            if self.df[col].dtype != object:
                self.df[col] = (self.df[col] - self.df[col].min()) / (self.df[col].max() - self.df[col].min())
        return self.df
    
    def get_structure(self):
        return self.df.shape
    
    def get_column_data(self, name):
        return self.df[name]
    
    def get_columns(self):
        return self.df.columns
    
    def get_sample(self, n):
        return self.df.sample(n, frac=1, replace=False)
    
    def get_granularity(self):
        num_rows = self.df.shape[0]
        all_cols = [col for col in self.df]
        primary_keys = []

        for col in all_cols:
            if self.df[col].nunique() == num_rows:
                primary_keys.append(col)
                return primary_keys
        for i in range(2, len(all_cols) + 1):
            colCombinations = it.combinations(all_cols, i)
            for subset in colCombinations:
                subset_as_list = [*subset]
                if self.df[subset_as_list].drop_duplicates().shape[0] == num_rows:
                    return subset_as_list

        return primary_keys if primary_keys else None
    
    # For KNN
    def identify_target_column(self):
        # Identify potential categorical columns
        df = self.df
        categorical_cols = [col for col in df.columns 
                            if df[col].nunique() <= 10 and df[col].dtype == 'object']
        
        # check to make sure not pKey
        potential_targets = [col for col in categorical_cols if df[col].nunique() < len(df)]
        
        # Return the first potential target column or raise a warning
        if potential_targets:
            return potential_targets[0]
        else:
            return "No target col available"
        


    def knn(self, target_col):
        n_neighbors = 9
        df = self.df.copy()  # Work on a copy to avoid altering the original data

        # Initialize label encoders for all columns
        label_encoders = {}

        # Iterate over all columns and encode if needed
        for col in df.columns:
            if df[col].dtype == 'object':  # Check for non-numeric columns
                le = LabelEncoder()
                df[col] = le.fit_transform(df[col].astype(str))  # Encode the column
                label_encoders[col] = le  # Store the encoder for future decoding

        # Separate features (X) and target (y)
        X = df.drop(columns=[target_col])
        y = df[target_col]

        # Split the data into train and test sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, shuffle=True)

        # Initialize and train the KNN classifier
        knn = KNeighborsClassifier(n_neighbors=n_neighbors)
        knn.fit(X_train, y_train)

        # Make predictions and calculate probabilities
        predictions = knn.predict(X_test)
        probabilities = knn.predict_proba(X_test)

        # Decode the target column back to original labels
        predictions_decoded = label_encoders[target_col].inverse_transform(predictions).tolist()
        
        # Prepare results with metadata
        return {
            "X_test": X_test.reset_index(drop=True).to_dict(orient='list'),  # Ensure indices align
            "predictions": predictions_decoded,
            "probabilities": probabilities.tolist(),
            "classes": label_encoders[target_col].inverse_transform(knn.classes_).tolist(),
            "feature_names": X.columns.tolist()
        }



        
    
    def clean(self, features):
        if(features["duplicate removal"] == True):
            self.remove_duplicates()
        if(features["missing value removal"] == True):
            self.remove_na()
        if(features["standardize time format"] == True):
            self.convert_time()
        if(features["standardize date format"] == True):
            self.convert_date()
        if(features["normalization"] == True):
            self.normalize_data()
        return self.df
        
