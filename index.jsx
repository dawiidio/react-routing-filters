import React, { useEffect, useState, createContext } from "react";

const ARRAY_VALUES_SEPARATOR = ",";

function splitHashToPathAndQuery(str) {
    return decodeURIComponent(str).split("?");
}

function createObjectFromUrlSearchParams(usp) {
    return Array.from(usp.entries()).reduce((acc, [key, val]) => {
        const splitedVal = val.includes(ARRAY_VALUES_SEPARATOR)
            ? val.split(ARRAY_VALUES_SEPARATOR)
            : val;

        return { ...acc, [key]: splitedVal };
    }, {});
}

export const FiltersContext = createContext({});

export function FiltersProvider({ children }) {
    const [filters, setFilters] = useState({});

    useEffect(() => {
        const handleHashChange = () => {
            try {
                const [, queryStr] = splitHashToPathAndQuery(window.location.hash);
                const usp = new URLSearchParams(queryStr);
                const filtersObject = createObjectFromUrlSearchParams(usp);

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
    }, []);

    function setUserFilters(filtersObject) {
        const filtersObjectWithExistingValues =
            Object.entries(filtersObject).filter(([, value]) => {
                if (value === false) return true;
                return !!value;
            }).reduce((accumulator, [key, value]) => ({
                ...accumulator,
                [key]: value
            }));

        const [path] = splitHashToPathAndQuery(window.location.hash);
        const usp = new URLSearchParams(filtersObjectWithExistingValues);

        window.location.hash = `${path}?${usp.toString()}`;
    }

    function resetFilters() {
        const [path] = splitHashToPathAndQuery(window.location.hash);
        window.location.hash = path;
    }

    const ctx = {
        filters,
        setFilters: setUserFilters,
        reset: resetFilters
    };

    return (
        <FiltersContext.Provider value={ctx}>{children}</FiltersContext.Provider>
    );
}
