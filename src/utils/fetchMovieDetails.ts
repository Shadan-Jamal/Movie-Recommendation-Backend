import axios from "axios";
import config from "../config/config.js";
import { MovieType } from "../types/movieType.js";

export const fetchMovie = async (imdbId: string) : Promise<MovieType | string> => {
    try {
        //MovieDetails
        const response : any = await axios.get(`${config.omdb_url}?apikey=${config.omdb_api_key}&i=${imdbId}`,{
            responseType : "json"
        });
        //if the id is not of a movie
        const type : string = response.data.Type
        console.log(type)
        if(type !== "movie"){
            return "Not a valid movie ID"
        }
        //For Full movie plot
        const response_plot : any = await axios.get(`${config.omdb_url}?apikey=${config.omdb_api_key}&i=${imdbId}`,{
            responseType : "json"
        }).then((res) => res.data)
        const full_plot : string = response_plot?.Plot

        const entries = ["Title","Rated","Year","Runtime","Genre","imdbRating","Plot"]
        let movie_details = Object.fromEntries(
            Object.entries(response.data).filter((entry) => entries.includes(entry[0]))
        );
        let movie_genres: string[] = typeof movie_details.Genre === "string" ? movie_details.Genre.split(",") : [];
        let link: string = `https://www.imdb.com/title/${imdbId}/`;
        let movie_combined_plot : string
        if(full_plot === movie_details.Plot){
            movie_combined_plot = full_plot
        }
        else{
            movie_combined_plot  = movie_details.Plot + " " + full_plot
        }
        return {
            title: typeof movie_details?.Title === "string" ? movie_details.Title : undefined,
            duration: typeof movie_details?.Runtime === "string" ? movie_details.Runtime : undefined,
            genres: movie_genres,
            movie_link: link,
            MPA:typeof movie_details?.Rated === "string" ? movie_details.Rated : undefined,
            year: typeof movie_details?.Year === "string" ? movie_details.Year : undefined,
            rating: typeof movie_details?.imdbRating === "string" ? movie_details.imdbRating : undefined,
            plot: typeof movie_combined_plot === "string" ? movie_combined_plot : "",
        };

    } catch (error) {
        console.error("❌ Error fetching movie details:", error);
        throw error;
    }
}