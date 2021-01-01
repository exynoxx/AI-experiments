//
// Created by nicholas on 05-04-2020.
//

#include "CNN.h"

int CNN::kernel3d(int *inn) {
    int kern[] = {-1, -1, -1,
                  -1, 8, -1,
                  -1, -1, -1};
    int ret = 0;
    for (int i = 0; i < 9; ++i) ret += inn[i] * kern[i];
    return ret;
}

void CNN::convolution(Image im) {
    matrix res;
    int x = 0;
    int y = 0;
    int rows = 29194;
    int cols = 100003;
    for (int i = 0; i < rows; ++i,++x) {
        for (int j = 0; j < cols; ++j,++y) {
            int arr[] = {im.pixel(i,j),im.pixel(i,j+1),im.pixel(i,j+2),
                         im.pixel(i+1,j),im.pixel(i+1,j+1),im.pixel(i+1,j+2),
                         im.pixel(i+2,j),im.pixel(i+2,j+1),im.pixel(i+2,j+2),};
            res.pixel(i,j) = kernel3d(&arr);
        }
    }
}