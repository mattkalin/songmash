library(dplyr)
library(jsonlite)
library(stringr)
{
  library(Rspotify)
  my_oauth <- spotifyOAuth(app_id="http://localhost:1410/", 
                           client_id="fe9d9cae7f8f434491d45b03408b1ffa", 
                           client_secret="c0d13fc984a54bc188e5d62ca066a6cb")
  
} # spotify token 
ratings.df = read.csv("../song ids.csv") %>% 
  # mutate(rating = 0) %>% 
  rename("_id" = id)
zero.cols = c()
zero.cols = c("rating", "win", "loss", "abstain")
ratings.df[, zero.cols] = 0
ratings.df[, c('title', 'artist', 'album')] = NA
# ratings.list = list()
pb = txtProgressBar(max = nrow(ratings.df), style = 3)
for (i in 1:nrow(ratings.df)) {
  # ratings.list[[i]] = as.list(ratings.df[i, ])
  # ratings.list[[i]][["histRate"]] = ratings.df[i, "rating"]
  # ratings.list[[i]][["matches"]] = 'null'
  song.info = get_track(ratings.df[i, "_id"])
  ratings.df[i, ] = ratings.df[i, ] %>% 
    mutate(title = song.info$name, 
           artist = paste(song.info$artists$name, collapse = ", "), 
           album = song.info$album$name) %>% 
    as.list()
  setTxtProgressBar(pb, i)
}
close(pb)
# ratings.object = list()
# for (i in 1:nrow(ratings.df)) {
#   ratings.object[[ratings.df[i, 'id']]] = list()
#   for (j in 2:ncol(ratings.df)) {
#     ratings.object[[ratings.df[i, 'id']]][[names(ratings.df)[j]]] = ratings.df[i, j]
#   }
# }
# ratings.list = list("ratings" = ratings.df, "updated" = Sys.time())
# ratings.list[['latest']] = 'true'
ratings.json = toJSON(ratings.df) %>% 
  str_replace_all("\\}", ',"histRate":[0],"matches":[]}')
  
# ratings.json = ratings.json %>% 
#   str_replace(intToUtf8(c(91, 34)), '"') %>%  # ["
#   str_replace(intToUtf8(c(34, 93)), '"')      # "]
# ratings.json = gsub('["', '"', ratings.json, fixed = TRUE)
# ratings.json = gsub('"]', '"', ratings.json, fixed = TRUE)
# ratings.json = gsub('id":["', 'id":"', ratings.json, fixed = TRUE)
# ratings.json = gsub('"],"rating":[0]', '","rating":0', ratings.json, fixed = TRUE)
# for(z in zero.cols){
#   ratings.json = gsub(paste0(z, '":[0]'), paste0(z, '":0'), ratings.json, fixed = TRUE)
# }
# ratings.json = gsub('"],"rating', '","rating', ratings.json, fixed = TRUE)
# ratings.json = gsub('"null"', '', ratings.json, fixed = TRUE)

write(ratings.json, "../ratings.json")

# write(ratings.json, "../test.json")

# x = read_json("../test.json")
