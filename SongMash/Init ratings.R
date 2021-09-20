library(dplyr)
library(jsonlite)
ratings.df = read.csv("../song ids.csv") %>% 
  mutate(rating = 0)
# ratings.object = list()
# for (i in 1:nrow(ratings.df)) {
#   ratings.object[[ratings.df[i, 'id']]] = list()
#   for (j in 2:ncol(ratings.df)) {
#     ratings.object[[ratings.df[i, 'id']]][[names(ratings.df)[j]]] = ratings.df[i, j]
#   }
# }
ratings.json = toJSON(ratings.df)
write(ratings.json, "../ratings.json")
