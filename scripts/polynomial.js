
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

function getPolynomial(coordinates)
{
    var size = coordinates.length;
    var coefficients = [];

    for (i = 0; i <= size; ++i)
        coefficients.push(getCoefficient(coordinates, size, i, 0));

    return coefficients;
}

// polynomial   : array of complex coefficients

function getDerivative(polynomial)
{
    var size = polynomial.length - 1;
    var derivative = [];

    for (i = 0; i < size; ++i)
        derivative.push(math.multiply(polynomial[i], size - i))

    return derivative;
}

// complexArray : array of complex numbers

function complexToUniformArray(complexArray)
{
    var size = complexArray.length;
    var uniformArray = [];

    for (i = 0; i < size; ++i)
    {
        uniformArray.push(math.re(complexArray[i]));
        uniformArray.push(math.im(complexArray[i]));
    }

    return uniformArray;
}
