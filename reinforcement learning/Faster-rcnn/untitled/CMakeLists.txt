# cmake_minimum_required(VERSION <specify CMake version here>)
project(untitled)

set(CMAKE_CXX_STANDARD 14)

add_executable(untitled main.cpp NN.cpp NN.h Layer.cpp Layer.h CNN.cpp CNN.h)