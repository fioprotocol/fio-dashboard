import React, { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router';
import { useDispatch } from 'react-redux';

import { useIsAdminRoute } from '../../../hooks/admin';
import { ROUTES } from '../../../constants/routes';
import { adminSearch } from '../../../redux/admin/actions';

const Search: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const isAdmin = useIsAdminRoute();

  const handleSearch = () => {
    dispatch(adminSearch(searchValue));
    if (location.pathname !== ROUTES.ADMIN_SEARCH_RESULT)
      history.push(ROUTES.ADMIN_SEARCH_RESULT);
  };

  return (
    <>
      {isAdmin ? (
        <div className="d-inline-block">
          <InputGroup>
            <Form.Control
              placeholder="Search"
              aria-label="Search"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyPress={(event: React.KeyboardEvent) => {
                if (event.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <Button
              disabled={!searchValue}
              variant="outline-primary"
              onClick={handleSearch}
            >
              Search
            </Button>
          </InputGroup>
        </div>
      ) : null}
    </>
  );
};

export default Search;
