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
        const filtersObjectWithExistingVales = Object.keys(filtersObject).filter(element => {
            if (filtersObject[element] === false) return true;
            return !!filtersObject[element];
        }).reduce((accumulator, current) => ({
            ...accumulator,
            [current]: filtersObject[current]
        }));

        const [path] = splitHashToPathAndQuery(window.location.hash);
        const usp = new URLSearchParams(filtersObjectWithExistingVales);

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
