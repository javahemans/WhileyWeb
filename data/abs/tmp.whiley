import * from whiley.lang.System

define nat as int where $ >= 0

/** 
 * Return the absolute of an integer parameter
 */
nat abs(int x):
    //
    if x >= 0:
    	return x
    else:
        return -x

void ::main(System.Console console):
    console.out.println("abs(1) = " + abs(1))
    console.out.println("abs(0) = " + abs(0))
    console.out.println("abs(-1) = " + abs(-1))