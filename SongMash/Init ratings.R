library(dplyr)
library(jsonlite)
library(stringr)
ratings.df = read.csv("../song ids.csv") %>% 
  # mutate(rating = 0) %>% 
  rename("_id" = id)
zero.cols = c("rating", "win", "loss", "abstain")
ratings.df[, zero.cols] = 0
ratings.list = list()
for (i in 1:nrow(ratings.df)) {
  ratings.list[[i]] = as.list(ratings.df[i, ])
  ratings.list[[i]][["histRate"]] = ratings.df[i, "rating"]
  ratings.list[[i]][["matches"]] = 'null'
}
# ratings.object = list()
# for (i in 1:nrow(ratings.df)) {
#   ratings.object[[ratings.df[i, 'id']]] = list()
#   for (j in 2:ncol(ratings.df)) {
#     ratings.object[[ratings.df[i, 'id']]][[names(ratings.df)[j]]] = ratings.df[i, j]
#   }
# }
# ratings.list = list("ratings" = ratings.df, "updated" = Sys.time())
# ratings.list[['latest']] = 'true'
ratings.json = toJSON(ratings.list)
# ratings.json = ratings.json %>% 
#   str_replace(intToUtf8(c(91, 34)), '"') %>%  # ["
#   str_replace(intToUtf8(c(34, 93)), '"')      # "]
# ratings.json = gsub('["', '"', ratings.json, fixed = TRUE)
# ratings.json = gsub('"]', '"', ratings.json, fixed = TRUE)
ratings.json = gsub('id":["', 'id":"', ratings.json, fixed = TRUE)
ratings.json = gsub('"],"rating":[0]', '","rating":0', ratings.json, fixed = TRUE)
for(z in zero.cols){
  ratings.json = gsub(paste0(z, '":[0]'), paste0(z, '":0'), ratings.json, fixed = TRUE)
}
# ratings.json = gsub('"],"rating', '","rating', ratings.json, fixed = TRUE)
ratings.json = gsub('"null"', '', ratings.json, fixed = TRUE)

write(ratings.json, "../ratings.json")
