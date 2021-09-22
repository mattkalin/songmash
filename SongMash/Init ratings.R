library(dplyr)
library(jsonlite)
library(stringr)
ratings.df = read.csv("../song ids.csv") %>% 
  mutate(rating = 0)
# ratings.object = list()
# for (i in 1:nrow(ratings.df)) {
#   ratings.object[[ratings.df[i, 'id']]] = list()
#   for (j in 2:ncol(ratings.df)) {
#     ratings.object[[ratings.df[i, 'id']]][[names(ratings.df)[j]]] = ratings.df[i, j]
#   }
# }
ratings.list = list("ratings" = ratings.df, "updated" = Sys.time())
# ratings.list[['latest']] = 'true'
ratings.json = toJSON(ratings.list)
# ratings.json = ratings.json %>% 
#   str_replace(intToUtf8(c(91, 34)), '"') %>%  # ["
#   str_replace(intToUtf8(c(34, 93)), '"')      # "]
ratings.json = gsub('["', '"', ratings.json, fixed = TRUE)
ratings.json = gsub('"]', '"', ratings.json, fixed = TRUE)
write(ratings.json, "../ratings.json")
