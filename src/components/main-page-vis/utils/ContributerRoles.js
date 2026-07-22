
//31: Collector, 32: Pefromer, 33: Singer, 34: Speach, 35: Composer


export function hasRole(piece, roleId) {
  return piece.creatorp_role?.some(
    person => person.role === roleId
  ) ?? false;
}

export function getNames(piece, roleId) {
  return (
    piece.creatorp_role
      ?.filter(person => person.role === roleId)
      .map(person => person.name) ?? []
  );
}

export function joinNames(names, separator = ", ") {
  return names.join(separator);
}