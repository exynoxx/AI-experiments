//
// Created by nicholas on 05-04-2020.
//

#include "Layer.h"

void Layer::init(int n, int h){
    W = Eigen::MatrixXd(n,h);
    b = Eigen::VectorXd(h);
}

Eigen::MatrixXd Layer::ReLU(Eigen::MatrixXd X){
    for (int i = 0; i < X.RowsAtCompileTime; ++i) {
        for (int j = 0; j < X.ColsAtCompileTime; ++j) {
            if(X(i,j) < 0) X(i,j)=0;
        }
    }
    return X;
}

Eigen::MatrixXd Layer::forward(Eigen::MatrixXd X){
    return ReLU(X*W);
}
