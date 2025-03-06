import React from 'react'
import { Button, InputGroup } from 'react-bootstrap'

const Search = () => {
    return (
        <InputGroup>
            <input type="text" className="form-control border-end-0" placeholder="Search Task Here" aria-describedby="button-addon2" />
            <Button aria-label="button" className="btn btn-light" variant='' type="button" id="button-addon2"><i className="ri-search-line text-primary"></i></Button>
        </InputGroup>
    )
}

export default Search
