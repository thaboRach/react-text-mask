echo "Expected arguments: 1) version"

version=$1

if [ -z "$version" ]; then
  echo "version is not set"
  exit 1
fi

npm run core:build

cd ./core

npm version $version

npm publish --access public
