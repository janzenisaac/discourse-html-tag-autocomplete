const DEFFAULT_HTML_TAG = [
  "b",
  "big",
  "blockquote",
  "code",
  "dd",
  "del",
  "dl",
  "dt",
  "em",
  "i",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "ins",
  "kbd",
  "li",
  "mark",
  "ol",
  "p",
  "pre",
  "s",
  "small",
  "strike",
  "strong",
  "sup",
  "ul",
];

let toSearch;
export function htmlTagSearch(term) {
  toSearch = toSearch || DEFFAULT_HTML_TAG.sort();

  const results = [];

  function addResult(t) {
    results.push(t);
  }

  for (let i = 0; i < toSearch.length; i++) {
    const item = toSearch[i];
    if (item.indexOf(term) === 0) {
      addResult(item);
    }
  }

  return results;
}
