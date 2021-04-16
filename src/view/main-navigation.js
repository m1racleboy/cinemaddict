const createMainNavigationItemTemplate = (filters) => {
  const { name, count } = filters;
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
  return `
    <a href="#${name}" class="main-navigation__item">${name.capitalize()} <span class="main-navigation__item-count">${count}</span></a>
  `;
};

export const createMainNavigationTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createMainNavigationItemTemplate(filter))
    .join('');

  return `
  <nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};
