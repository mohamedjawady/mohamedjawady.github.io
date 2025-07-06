---
title: "Lagrange Interpolation Visualization"
description: "Interactive visualization of Lagrange interpolation showing how polynomials pass through given points using basis polynomials and mathematical interpolation"
date: "2025-01-07"
author: "Mohamed Habib Jaouadi"
tags: ["mathematics", "interpolation", "polynomials", "numerical-analysis", "interactive", "lagrange", "easter-egg"]
component: "LagrangeInterpolation"
visibility: "public"
---

Lagrange interpolation is a method for finding a polynomial that passes through a given set of points. This interactive visualization demonstrates how the Lagrange interpolating polynomial is constructed using basis polynomials and how it perfectly fits through all the given data points.

## Mathematical Background

Given $n+1$ distinct points $(x_0, y_0), (x_1, y_1), \ldots, (x_n, y_n)$, the Lagrange interpolating polynomial $P(x)$ is defined as:

$$P(x) = \sum_{i=0}^{n} y_i \cdot L_i(x)$$

Where $L_i(x)$ are the Lagrange basis polynomials:

$$L_i(x) = \prod_{\substack{j=0 \\ j \neq i}}^{n} \frac{x - x_j}{x_i - x_j}$$
