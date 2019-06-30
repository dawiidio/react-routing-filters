# React routing filters

[DEMO 1](https://codesandbox.io/s/react-routing-filters-1-n8dbu)

[DEMO 2](https://codesandbox.io/s/react-routing-filters-2-qre1e)

Package allows you to share filters (or other serializable data) across url's,
even if you using `HashRouter`. Urls are copyable across application :)

E.g.: if you want to pass object like below in application url
```js
{
    name: 'Dave',
    surname: 'Wo'
}
```

with this library you can achieve something like this:
`localhost:3000/#/users/?name=Dave&surname=Wo`

### Usage

#### FiltersProvider
Provides context which looks like this:
```ts
interface FiltersContext<T> {
    filters: T,
    setFilters: (filters:T) => void,
    reset: () => void
}
```

**Warning** <br>
if you want set in filters array like this:

```js
setFilters({
  random: [Math.random(), Math.random()]
});
```

you need to remember that values passed in array
can not contains comas. It's because filters are
parsed according to URL search string rules
which specify that comas are separators for one-to-many
values

#### Example
```js
import { FiltersProvider, FiltersContext } from 'react-routing-filters';

function FiltersButton() {
  const { setFilters } = useContext(FiltersContext);

  const handleClick = () => setFilters({
      random: Math.random()
    });

  return <button onClick={handleClick}>
    Set random filter
  </button>
}

function LogFilters() {
  const { filters } = useContext(FiltersContext);

  return <pre>{JSON.stringify(filters, null, 4)}</pre>;
}

function App() {
  return (
    <FiltersProvider>
      <div>
        <FiltersButton />
        <LogFilters />
      </div>
    </FiltersProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```
