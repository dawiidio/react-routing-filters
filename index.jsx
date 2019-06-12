import React, { useEffect, useState, createContext } from "react";

function splitHashToPathAndQuery(str) {
    return decodeURIComponent(str).split("?");
}

const FILTERS_KEY = "filters";

export const FiltersContext = createContext({});

export function FiltersProvider({ children }) {
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const handleHashChange = () => {
            try {
                const [, queryStr] = splitHashToPathAndQuery(window.location.hash);
                const usp = new URLSearchParams(queryStr);
                const filtersObject = JSON.parse(usp.get(FILTERS_KEY));

                setFilters(filtersObject || {});
            } catch (e) {
                setFilters({});
            }
        };

        handleHashChange();

        window.onhashchange = handleHashChange;

        return () => {
            window.onhashchange = null;
        };
    }, [1]);

    function setUserFilters(filtersObject) {
        const [path, queryStr] = splitHashToPathAndQuery(window.location.hash);
        const usp = new URLSearchParams(queryStr);

        usp.set(FILTERS_KEY, JSON.stringify(filtersObject));

        window.location.hash = `${path}?${usp.toString()}`;
    }

    const ctx = {
        filters,
        setFilters: setUserFilters,
        reset: () => setUserFilters()
    };

    return (
        <FiltersContext.Provider value={ctx}>{children}</FiltersContext.Provider>
    );
}
