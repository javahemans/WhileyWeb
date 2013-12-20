import * from whiley.lang.System

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

void ::main(System.Console console):
    console.out.println("max(10,0) = " + max(10,0))
    console.out.println("max(5,6) = " + max(5,6))
    console.out.println("max(0,0) = " + max(0,0))