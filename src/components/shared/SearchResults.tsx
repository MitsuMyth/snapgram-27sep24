import { Models } from 'appwrite';
import Loader from './Loader';
import GridPostList from './GridPostList';

type SearchResultsProps = {
    isSearchFetching: boolean;
    searchedPosts: Models.Document[] | null; // Allow null or an array
};

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultsProps) => {
    if (isSearchFetching) return <Loader />;

    // Check if searchedPosts is not null and has documents
    if (searchedPosts && searchedPosts.length > 0) {
        return (
            <GridPostList posts={searchedPosts} />
        );
    }

    return (
        <p className="text-light-4 mt-10 text-center w-full">
            No results found
        </p>
    );
};

export default SearchResults;
