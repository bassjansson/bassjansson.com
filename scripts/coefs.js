
// coordinates  : array of complex coordinates
// size         : number of coordinates
// coefficient  : the coefficient to calculate (0 <= c <= size)
// position     : start position of coordinates

function getCoefficient(coordinates, size, coefficient, position)
{
    if (coefficient <= 0)   return 1.0;
    if (coefficient > size) return 0.0;

    var coef1 = getCoefficient(coordinates, size - 1, coefficient - 1, position + 1);
    var coef2 = getCoefficient(coordinates, size - 1, coefficient    , position + 1);

    return math.add(math.multiply(math.multiply(-1.0, coordinates[position]), coef1), coef2);
}

// coordinates  : array of complex coordinates

function getCoefficients(coordinates)
{
    var coefficients = [math.complex(1.0)];
    var size = coordinates.length;

    for (i = 0; i < size; ++i)
        coefficients.push(getCoefficient(coordinates, size, i + 1, 0));

    return coefficients;
}
