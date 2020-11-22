import Layout from "../../components/Layout";
import client from "../../components/ApolloClient";
import Product from "../../components/Product";
import {PRODUCT_BY_CATEGORY_SLUG, PRODUCT_CATEGORIES_SLUGS} from "../../queries/product-by-category";
import {isEmpty} from "lodash";

export default function CategorySingle( props ) {

    const { categoryName, products } = props;

    return (
        <Layout>
            <div className="product-categories-container container mx-auto my-32 px-4 xl:px-0">
                { categoryName ? <h3 className="text-2xl mb-5 uppercase">{ categoryName }</h3> : '' }
                <div className="product-categories grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                    { undefined !== products && products?.length ? (
                        products.map( product => <Product key={ product?.id } product={ product } /> )
                    ) : ''}
                </div>
            </div>
        </Layout>
    )
};

export async function getStaticProps(context) {

    const {params: { slug }} = context

    const {data} = await client.query(({
        query: PRODUCT_BY_CATEGORY_SLUG,
        variables: { slug }
    }));

    return {
        props: {
            categoryName: data?.productCategory?.name || '',
            products: data?.productCategory?.products?.nodes || []
        },
        revalidate: 1
    }

}

export async function getStaticPaths () {
    const { data } = await client.query({
        query: PRODUCT_CATEGORIES_SLUGS
    })

    const pathsData = []

    data?.productCategories?.nodes && data?.productCategories?.nodes.map((productCategory) => {
        if (!isEmpty(productCategory?.slug)) {
            pathsData.push({ params: { slug: productCategory?.slug } })
        }
    })

    return {
        paths: pathsData,
        fallback: false
    }
}
