import React, { useState, useEffect } from "react";
import { Button, InputGroup } from "react-bootstrap";

const Search = ({ list = [], onSearch = () => {} }) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!Array.isArray(list)) return;

    const filteredList = list.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
    );

    onSearch(filteredList); // Send new search data to the parent
  }, [query]); // Depend only on query to avoid infinite loops

  return (
    <InputGroup>
      <input
        type="text"
        className="form-control border-end-0"
        placeholder="Search Task Here"
        aria-describedby="button-addon2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button aria-label="button" className="btn btn-light" variant="" type="button" id="button-addon2">
        <i className="ri-search-line text-primary"></i>
      </Button>
    </InputGroup>
  );
};

export default Search;
