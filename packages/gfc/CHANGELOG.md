# Change Log

<!-- All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines. -->


## [2.4.0](https://github.com/sumbad/web-companions/compare/@web-companions/gfc@2.4.0) (2024-08-31)

- Validate required properties on connected callback


## [2.1.3](https://github.com/sumbad/web-companions/compare/@web-companions/gfc@2.1.2...@web-companions/gfc@2.1.3) (2023-06-13)


### Bug Fixes

* **gfc:** Use always last instance of properties for updating ([1c4c60a](https://github.com/sumbad/web-companions/commit/1c4c60abbe5d5aad471fbd56200f4cc66fe105fc))





## [2.1.2](https://github.com/sumbad/web-companions/compare/@web-companions/gfc@2.1.1...@web-companions/gfc@2.1.2) (2023-05-18)


### Bug Fixes

* **gfc:** replace commonjs imports to es imports ([6f53fb3](https://github.com/sumbad/web-companions/commit/6f53fb3a3c626895809a1ec3e4b25d59622b3c34))





## [2.1.1](https://github.com/sumbad/web-companions/compare/@web-companions/gfc@2.1.0...@web-companions/gfc@2.1.1) (2023-05-04)


### Bug Fixes

* update exports ([4e04783](https://github.com/sumbad/web-companions/commit/4e047836cc7d9f9a1da9303fc45bcb7079583538))





# [2.1.0](https://github.com/sumbad/web-companions/compare/@web-companions/gfc@2.1.0-develop.1...@web-companions/gfc@2.1.0) (2023-05-03)

**Note:** Version bump only for package @web-companions/gfc





-->

## [2.0.3](https://github.com/sumbad/web-companions/compare/@web-companions/gfc@2.0.2...@web-companions/gfc@2.0.3) (2022-08-16)


### Bug Fixes

* **gfc:** Set a default 'ref' object for each new Node component ([b534775](https://github.com/sumbad/web-companions/commit/b534775a0edabe834e4084256fc429121a3ff156))





## [2.0.2](https://github.com/sumbad/web-companions/compare/@web-companions/gfc@2.0.0...@web-companions/gfc@2.0.2) (2022-08-16)


### Bug Fixes

* Don't show a TypeScript error for Nodes without parameters ([f5eb835](https://github.com/sumbad/web-companions/commit/f5eb835d5a18928b76edf8a38ec1669c85f8b363))


## [2.0.1](https://github.com/sumbad/web-companions/compare/@web-companions/gfc@2.0.0...@web-companions/gfc@2.0.1) (2022-07-16)

### Bug Fixes

  - Operate Nodes inside Elements independently

  

# [2.0.0](https://github.com/sumbad/web-companions/compare/@web-companions/gfc@1.3.0...@web-companions/gfc@2.0.0) (2022-07-08)

### Added

  - Create a new "smart" mapper - setProp function. 
    It will update Element's properties inside a Micro Task. So that all new values which were sent at once will be updated together.

### Changed

  - Set the new mapper for a component's properties as a default mapper
  - The state property was removed from EGMapper type

### Removed

  - The defMapper function was deleted



# [1.2.0](https://github.com/sumbad/web-companions/compare/@web-companions/gfc@1.1.1...@web-companions/gfc@1.2.0) (2022-06-29)

### Added
  - Add a new special attribute 'key' for Nodes to identify different Nodes within conditions


# [1.1.1](https://github.com/sumbad/web-companions/compare/@web-companions/gfc@1.101...@web-companions/gfc@1.1.1) (2022-06-17)

### Bug Fixes
  - Return a completed type for a component's element with replaced This type


# [1.1.0](https://github.com/sumbad/web-companions/compare/@web-companions/gfc@1.0.1...@web-companions/gfc@1.1.0) (2022-02-24)

### Added
  - Replace a component properties through the "next" function


# [1.0.2](https://github.com/sumbad/web-companions/compare/@web-companions/gfc@1.0.1...@web-companions/gfc@1.0.2) (2021-12-08)


### Bug Fixes

* **gfc:** change jsx.d.ts to jsx.ts file ([2eb349d](https://github.com/sumbad/web-companions/commit/2eb349d34071a5918348dd98f5ce51e75df40f15))



# [1.0.1](https://github.com/sumbad/web-companions/compare/@web-companions/gfc@1.0.0...@web-companions/gfc@1.0.1) (2021-12-08)


### Bug Fixes

* Return strict checks for JSX elements ([f89ada2](https://github.com/sumbad/web-companions/commit/f89ada2bc41726c25fe87e4dc1aa57ea31d6691c))


# [1.0.0](https://github.com/sumbad/web-companions/compare/@web-companions/gfc@0.0.2...@web-companions/gfc@1.0.0) (2021-12-02)

### Added
  - Support 'finally' block inside components. This code will be run on 'disconnectedCallback' lifecycle callback.

### Changed
  - New API for element constructor. Improve DX.
  - Update types for 'EG' functions.


# [0.0.2](https://github.com/sumbad/web-companions/compare/@web-companions/gfc@0.0.1...@web-companions/gfc@0.0.2) (2021-10-13)

**Note:** Version bump only for package @web-companions/gfc


# [0.0.1](https://github.com/sumbad/web-companions/compare/@web-companions/gfc@0.0.1-develop.4...@web-companions/gfc@0.0.1) (2021-10-12)

**Note:** Version bump only for package @web-companions/gfc


---
---
---


The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).







<!-- ## [X.Y.Z] - YYYY-MM-DD -->

<!-- ### Added -->
<!-- ### Changed -->
<!-- ### Deprecated -->
<!-- ### Removed -->
<!-- ### Bug Fixes -->
<!-- ### Security -->
<!-- ## Unreleased -->
