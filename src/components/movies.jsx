import React, { Component } from "react";
import { getMovies } from "../services/fakeMovieService";
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup";
import { paginate } from "../utils/paginate";
import { getGenres } from "../services/fakeGenreService";
import MoviesTable from "./moviesTable";
import _ from "lodash";

class Movies extends Component {
	state = {
		movies: [],
		pageSize: 4,
		currentPage: 1,
		genres: [],
		sortColumn: { path: "title", order: "asc" },
	};

	componentDidMount() {
		const genres = [{ _id: "", name: "All Genres" }, ...getGenres()];
		this.setState({ movies: getMovies(), genres: genres });
	}

	handleDelete = (movie) => {
		// return arr.filter(function(geeks){return geeks != value; });
		// spliced = arr.splice(i, 1);
		// delete array[2]

		// console.log("Before");
		// console.log(this.state.movies);
		// console.log(this.state.movies.length);

		for (var i = 0; i < this.state.movies.length; i++) {
			if (this.state.movies[i]["title"] === movie) {
				this.state.movies.splice(i, 1);
				break;
			}
		}
		this.setState({ movies: this.state.movies });

		// console.log("After");
		// this.state.movies.splice(0, 1);
		// console.log(this.state.movies);
		// console.log(this.state.movies.length);
	};

	// handleChange() {
	//   let click = this.state.click;
	//   click += 1;
	//   this.setState({ click });
	// }

	// getBadgeClass() {
	//   let classes =
	//     this.state.click % 2 === 0 ? (
	//       <i className="far fa-heart"></i>
	//     ) : (
	//       <i className="fas fa-heart"></i>
	//     );
	//   return classes;
	// }

	handleLike = (movie) => {
		const movies = [...this.state.movies];
		const index = movies.indexOf(movie);
		//movies[index] = { ...counter };
		movies[index].liked = !movies[index].liked;
		this.setState({ movies });
	};

	handlePageChange = (page) => {
		this.setState({ currentPage: page });
	};

	handleGenresSelect = (genres) => {
		this.setState({ selectedGenre: genres, currentPage: 1 });
	};

	handleSort = (sortColumn) => {
		this.setState({ sortColumn });
	};

	getPagedData = () => {
		const filtered =
			this.state.selectedGenre && this.state.selectedGenre._id
				? this.state.movies.filter(
						(m) => m.genre._id === this.state.selectedGenre._id
				  )
				: this.state.movies;

		const sorted = _.orderBy(
			filtered,
			[this.state.sortColumn.path],
			[this.state.sortColumn.order]
		);

		const movies = paginate(
			sorted,
			this.state.currentPage,
			this.state.pageSize
		);
		return { totalCount: filtered.length, data: movies };
	};
	//padding added from index.css
	render() {
		const { length: count } = this.state.movies;

		if (count === 0) return <p>No movies present in the database</p>;

		const { totalCount, data: movies } = this.getPagedData();
		return (
			<div className="container">
				<div className="row">
					<div className="col-3">
						<ListGroup
							items={this.state.genres}
							onItemSelect={this.handleGenresSelect}
							selectedItem={this.state.selectedGenre}
						/>
					</div>
					<div className="col">
						<p>Showing {totalCount} movies in the database.</p>
						<MoviesTable
							movies={movies}
							onLike={this.handleLike}
							onDelete={this.handleDelete}
							onSort={this.handleSort}
							sortColumn={this.state.sortColumn}
						/>
						<Pagination
							itemsCount={totalCount}
							pageSize={this.state.pageSize}
							currentPage={this.state.currentPage}
							onPageChange={this.handlePageChange}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default Movies;
