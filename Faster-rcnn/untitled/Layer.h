//
// Created by nicholas on 05-04-2020.
//

#ifndef UNTITLED_LAYER_H
#define UNTITLED_LAYER_H

#include "Eigen/Dense"

class Layer {

public:
    Eigen::MatrixXd W;
    Eigen::MatrixXd b;

    void init(int n, int h);
    Eigen::MatrixXd forward(Eigen::MatrixXd X);
    Eigen::MatrixXd ReLU(Eigen::MatrixXd X);
};


#endif //UNTITLED_LAYER_H
