//
// Created by nicholas on 05-04-2020.
//

#include "NN.h"

NN::NN(int n, int d) {
    W = Eigen::MatrixXd(n, d);
}
