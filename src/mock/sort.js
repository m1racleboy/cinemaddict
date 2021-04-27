const sorts = [
  {
    name: 'default',
    current: true,
  },
  {
    name: 'date',
    current: false,
  },
  {
    name: 'rating',
    current: false,
  },
];

export const createSort = () => {
  return Object.values(sorts).map((sort) => {
    return {
      name: sort.name,
      current: sort.current,
    };
  });
};
