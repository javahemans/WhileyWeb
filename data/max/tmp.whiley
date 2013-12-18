/** 
 * The max() function, which returns the greater 
 * of two integer arguments
 */
int max(int x, int y)
// result must be one of the arguments
ensures $ == x || $ == y,
// result must be greater-or-equal than arguments
ensures $ >= x && $ >= y:
    //
    if x > y:
    	return x
    else:
        return y
