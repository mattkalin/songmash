{
  {
    library(stringr)
    library(httr)
    rollingstone.urls = c(
      "https://www.rollingstone.com/music/music-lists/best-songs-of-all-time-1224767/kanye-west-stronger-1224837/", 
      "https://www.rollingstone.com/music/music-lists/best-songs-of-all-time-1224767/neil-young-powderfinger-1224887", 
      "https://www.rollingstone.com/music/music-lists/best-songs-of-all-time-1224767/david-bowie-station-to-station-3-1224938/", 
      "https://www.rollingstone.com/music/music-lists/best-songs-of-all-time-1224767/john-prine-angel-from-montgomery-1224988/", 
      "https://www.rollingstone.com/music/music-lists/best-songs-of-all-time-1224767/the-b-52s-rock-lobster-2-1225038", 
      "https://www.rollingstone.com/music/music-lists/best-songs-of-all-time-1224767/jimi-hendrix-purple-haze-2-1225088/", 
      "https://www.rollingstone.com/music/music-lists/best-songs-of-all-time-1224767/david-bowie-changes-2-1225138/", 
      "https://www.rollingstone.com/music/music-lists/best-songs-of-all-time-1224767/green-day-basket-case-1225188/", 
      "https://www.rollingstone.com/music/music-lists/best-songs-of-all-time-1224767/bob-dylan-blowin-in-the-wind-3-1225238/", 
      "https://www.rollingstone.com/music/music-lists/best-songs-of-all-time-1224767/daddy-yankee-feat-glory-gasolina-1225288"
    )
    rollingstone.songs = NULL
    for (url in rollingstone.urls) {
      html = rawToChar(GET(url)$content)
      title.locs = gregexpr('"title":', html)[[1]]
      for(i in title.locs){
        title.str = substr(html, i, i+100)
        subtitle.loc = regexpr("subtitle", title.str)
        if(subtitle.loc != -1){
          artist.title = substr(title.str, 10, subtitle.loc - 4)
          rollingstone.songs = rollingstone.songs %>% c(artist.title)
        }
      }
      # if(length(rollingstone.songs) %% 50 != 0){
      #   print(url)
      # }
    }
    # missing song is: 
    # Craig Mack feat. Notorious B.I.G., LL Cool J, Busta Rhymes, Rampage, 
    # 'Flava in Ya Ear (Remix)'
    # I'm not pressed about leaving this one out lol
    {
      rollingstone.songs = rollingstone.songs %>% 
        str_replace_all("u00d6", "O") %>% 
        str_replace_all("u2019", "'") %>% 
        str_replace_all("u00e9", "e") %>% 
        str_replace_all("u00f6", "o") %>% 
        str_replace_all("u00e7", "c") #%>% 
      rollingstone.songs = gsub("\\", "", rollingstone.songs, fixed = TRUE)
      # str_replace_all("\u00e9", "e") %>% 
      
    } # fix special characters
    rollingstone.titles = rollingstone.songs %>% 
      str_extract(", '.*$")
  } # getting title/artist songs from rolling stone's top 500 list
  {
    library(Rspotify)
    my_oauth <- spotifyOAuth(app_id="http://localhost:1410/", 
                             client_id="fe9d9cae7f8f434491d45b03408b1ffa", 
                             client_secret="c0d13fc984a54bc188e5d62ca066a6cb")
    # myUserId = "ifne936g9eq00q87nbcwtmpwb"
    {
      {
        # savage remix by megan? (this is fine)
        # i like it cardi b 
        # mamas and papas cali dreamin wrong version 
        # teenage riot sonic youth
      } # notes
      rollingstone.search = rollingstone.songs
      rollingstone.search[116] = "i like it cardi b"
      rollingstone.search[80]  = "Mamas papas california dreamin"
      rollingstone.search[343] = "teen age riot sonic youth"
      rollingstone.search[232] = "shout isley"
      rollingstone.search[471] = "g thang dr dre snoop dogg"
      rollingstone.search[97] = "aint nobody rufus chaka khan"
      rollingstone.search[185] = "a love supreme acknowledgement john coltrane"
      rollingstone.search[398] = "maybellene chuck berry"
      rollingstone.search[149] = "ponta de lanca africano jorge ben"
      rollingstone.search[384] = "it takes two rob base ez rock"
      rollingstone.search[72] = "under pressure queen"
      rollingstone.search[112] = "party up dmx"
      rollingstone.search[202] = "jungleland bruce springsteen"
      rollingstone.search[466] = "papas got a brand new bag james brown"
      rollingstone.search[49] = "africa toto iv"
    } # search strings
    rollingstone.spotify = data.frame()
    pb = txtProgressBar(max = length(rollingstone.songs), style = 3)
    for (i in 1:length(rollingstone.songs)) {
      tryCatch({
        search.results = searchTrack(rollingstone.search[i], my_oauth)
      }, error = function(e){
        search.results <<- searchTrack(rollingstone.titles[i], my_oauth)
      })
      if(rollingstone.search[i] == "The Beatles, 'Help!'"){
        search.results = search.results[-1, ]
      }
      rollingstone.spotify = rollingstone.spotify %>% 
        rbind(search.results[1, ])
      setTxtProgressBar(pb, i)
    }
    close(pb)
    
  } # search and add spotify ids
  rollingstone.spotify = rollingstone.spotify %>% 
    filter(popularity > 45)
  rollingstone.ids = rollingstone.spotify$id
  if(FALSE){
    WritePlaylist = function(playlist.name, song.ids){
      # playlist MUST be empty initially 
      user.id = "ifne936g9eq00q87nbcwtmpwb"
      id <- "fe9d9cae7f8f434491d45b03408b1ffa"
      secret <- "c0d13fc984a54bc188e5d62ca066a6cb"
      Sys.setenv(SPOTIFY_CLIENT_ID = id)
      Sys.setenv(SPOTIFY_CLIENT_SECRET = secret)
      authorization = get_spotify_authorization_code(scope = scopes[-c(11)])
      my.playlists = getPlaylists(user.id, token = my_oauth)
      playlist.row = my.playlists %>% 
        filter(name == playlist.name)
      song.ids = song.ids[which(nchar(song.ids) == 22)]
      if(nrow(playlist.row) == 0){
        stop("Playlist not found")
      }
      if(playlist.row$tracks != 0){
        stop("Clear playlist before adding tracks")
      }
      playlist.id = playlist.row$id
      AddTracksToPlaylist(playlist.id, 
                          paste0("spotify:track:", song.ids),
                          authorization)
    }
    CreatePlaylist = function(playlist.name, song.ids = NULL, overwrite = FALSE, 
                              public = TRUE, collaborative = FALSE, 
                              description = NULL, 
                              user.id = "ifne936g9eq00q87nbcwtmpwb"){
      require(httr)
      user.id = "ifne936g9eq00q87nbcwtmpwb"
      id <- "fe9d9cae7f8f434491d45b03408b1ffa"
      secret <- "c0d13fc984a54bc188e5d62ca066a6cb"
      Sys.setenv(SPOTIFY_CLIENT_ID = id)
      Sys.setenv(SPOTIFY_CLIENT_SECRET = secret)
      authorization = get_spotify_authorization_code(scope = scopes[-c(11)])
      {
        my.playlists = getPlaylists(user.id, token = my_oauth)
        playlist.row = my.playlists %>% 
          dplyr::filter(name == playlist.name)
        if(nrow(playlist.row) > 0){
          if(overwrite){
            stop("Not yet implemented :(")
          } else {
            stop(paste0("Playlist already exists. ", 
                        "Either delete playlist or change overwrite to TRUE"))
          }
        }
        # if playlist doesn't already exist, no problem 
      } # check if playlist already exists 
      {
        base_url <- "https://api.spotify.com/v1/users"
        url <- paste0(base_url, "/", user.id, "/playlists")
        params <- list(name = playlist.name, public = public, 
                       collaborative = collaborative, description = description)
        res <- RETRY("POST", url, body = params, config(token = authorization), 
                     encode = "json")
        stop_for_status(res)
        res <- fromJSON(content(res, as = "text", encoding = "UTF-8"))
        # return(res) # don't think I need 
      } # create the playlist
      if(length(song.ids) > 0){
        WritePlaylist(playlist.name, song.ids) # add the songs
      }
      
      
      # spotify.url = paste0("https://api.spotify.com/v1/users/", user.id, 
      #                      "/playlists")
      # params <- list(name = playlist.name, public = public, 
      #                collaborative = collaborative, 
      #                description = description) %>% toJSON() 
      # # %>% str_replace(",\"\"", "") # fixes the bug when uri is of length 1
      # POST(url = spotify.url, config = config(token = authorization), 
      #      body = params, encode = "json")
    }
    AddTracksToPlaylist = function(playlist.id, uris, authorization, 
                                   position = NULL){
      spotify.url = paste0("https://api.spotify.com/v1/playlists/", playlist.id, 
                           "/tracks")
      {
        n.tracks = length(uris)
        track.chunks = list()
        curr.index = 1
        while (curr.index < n.tracks) {
          track.chunks[[length(track.chunks) + 1]] = 
            curr.index:(min(curr.index + 99, n.tracks))
          curr.index = curr.index + 100
        }
      } # partition into 100 each
      for (i in 1:length(track.chunks)) {
        params <- list(uris = c(uris[track.chunks[[i]]], "")) %>% toJSON() %>% 
          str_replace(",\"\"", "") # fixes the bug when uri is of length 1
        POST(url = spotify.url, config = config(token = authorization), 
             body = params, encode = "json")
      }
    }
    
    CreatePlaylist("Rolling Stone top 500", rollingstone.ids)
  } # write to spotify playlist (doesn't work)
  
} # rolling stone
{
  GetAllPlaylistSongs = function(playlist.id, user.id = "ifne936g9eq00q87nbcwtmpwb", 
                                 token = my_oauth, print.name = TRUE, 
                                 debug.mode = FALSE, maxScrapeLimit = 100, 
                                 my.playlists = NULL){
    if(maxScrapeLimit > 100){
      maxScrapeLimit = 100
    }
    scrapeLimit = maxScrapeLimit
    if(is.null(my.playlists) || !(playlist.id) %in% my.playlists$id){
      playlists = getPlaylists(user.id, token = my_oauth)
      my.playlists <<- playlists
    } else {
      playlists = my.playlists
    }
    playlist.length = playlists[match(playlist.id, playlists$id), "tracks"]
    if(playlist.length < 1){
      return(NULL)
    }
    songs.df = data.frame()
    playlist.offset = 0
    if(print.name){
      if(!(playlist.id %in% playlists$id)){
        print("Playlist name not found")
      } else {
        playlist.name = playlists %>% filter(id == as.character(playlist.id)) %>% 
          select(name)
        print(paste0("Loading songs from ", playlist.name, "..."))
      }
    } else {
      print("Loading playlist songs...")
    }
    if(!debug.mode){
      pb = txtProgressBar(0, playlist.length, style = 3)
    }
    while (playlist.offset < playlist.length) {
      section.clear = FALSE
      error.caught = FALSE
      all.local.files = FALSE
      # if(scrapeLimit < maxScrapeLimit){
      scrapeLimit = maxScrapeLimit
      # }
      while (!section.clear) {
        tryCatch({
          if(debug.mode){
            print(paste0("Attempting offset: ", playlist.offset, 
                         ", scrape limit ", scrapeLimit))
          }
          playlist.songs = getPlaylistSongs(user.id, playlist.id, 
                                            playlist.offset, token, 
                                            scrape.limit = scrapeLimit)
          if(debug.mode){
            print(paste0("Offset: ", playlist.offset, 
                         ", first song: ", playlist.songs[1, "tracks"]))
          }
          section.clear = TRUE
        }, error = function(e){
          if(debug.mode){
            # print(e)
            # it's gonna be the undefined cols thing 
          }
          if(maxScrapeLimit > 20){
            maxScrapeLimit <<- 20
            # if one local file encountered, there might be more 
          }
          if(playlist.offset > playlist.length){
            section.clear <<- TRUE
            all.local.files <<- TRUE
          } else if(scrapeLimit > maxScrapeLimit){
            scrapeLimit <<- maxScrapeLimit
            # not sure how this would happen tbh 
          } else if(scrapeLimit > 1){
            # scrapeLimit <<- scrapeLimit - 1
            scrapeLimit <<- floor(scrapeLimit / 2) 
            # } else if(playlist.offset > 0 & scrapeLimit == 20){
            #   playlist.offset <<- playlist.offset - 1
          } else {
            # scrapelimit == 1, so the first song is a local file. Skip it. 
            playlist.offset <<- playlist.offset + 1
            scrapeLimit <<- maxScrapeLimit
          }
          error.caught <<- TRUE
        })
      }
      if(all.local.files){
        break()
      }
      songs.df = rbind(songs.df, playlist.songs)
      playlist.offset = playlist.offset + scrapeLimit # + error.caught
      # if(error.caught){
      #   section.clear = FALSE
      #   while(!section.clear){
      #     tryCatch({
      #       playlist.songs = getPlaylistSongs(user.id, playlist.id, 
      #                                         playlist.offset, token)
      #       section.clear = TRUE
      #     }, error = function(e){
      #       playlist.offset <<- playlist.offset + 1
      #     })
      #   }
      # }
      if(!debug.mode){
        setTxtProgressBar(pb, nrow(songs.df))
      }
    }
    if(!debug.mode){
      setTxtProgressBar(pb, playlist.length)
      close(pb)
    }
    return(songs.df)
  }
  getPlaylistSongs = function (user_id, playlist_id, offset = 0, token, 
                               scrape.limit = scrapeLimit){
    req <- httr::GET(paste0("https://api.spotify.com/v1/users/", 
                            user_id, "/playlists/", playlist_id, "/tracks?&limit=", scrape.limit, "&offset=", 
                            offset), httr::config(token = token))
    json1 <- httr::content(req)
    json2 <- jsonlite::fromJSON(jsonlite::toJSON(json1))$items
    tracks <- unlist(json2$track$name)
    popularity <- unlist(json2$track$popularity)
    id <- unlist(json2$track$id)
    artist <- unlist(lapply(seq(1:length(tracks)), function(x) {
      return(data.frame(json2$track$artists[x])$name[1])
    }))
    artist_full <- sapply(lapply(seq(1:length(tracks)), function(x) {
      return(data.frame(json2$track$artists[[x]])$name)
    }), paste, collapse = "; ")
    artist_id <- unlist(lapply(seq(1:length(tracks)), function(x) {
      return(data.frame(json2$track$artists[x])$id[1])
    }))
    album <- unlist(json2$track$album$name)
    album_id <- unlist(json2$track$album$id)
    added.at = as.POSIXct(unlist(json2$added_at))
    playlistSongs <- data.frame(tracks, id, popularity, artist, artist_full, 
                                artist_id, album, album_id, added.at, stringsAsFactors = F)
    return(playlistSongs)
  }
  
  
  hodgepodge.ids = GetAllPlaylistSongs("3imgj3r6m9leM0B9Q644Zv")
} # read in popular hodgepodge
id.data = data.frame("id" = c(rollingstone.ids, hodgepodge.ids$id))
# write.csv(id.data, "../song ids.csv", row.names = FALSE)
xlsx::write.xlsx(id.data, "../song ids.xlsx", row.names = FALSE)
print("Need to manually save the xlsx file as a csv")
