'use strict';

/**
 * form-cloner.js controller
 *
 * @description: A set of functions called "actions" of the `form-cloner` plugin.
 */

const _ = require("lodash");
module.exports = {
  start: async (ctx) => {
    const { data } = ctx.request.body;
    if (data) {
      const {
        categories: _categories,
        id: formId,
        categoryForm: { id: categoryFormId, ...categoryForm },
        color: { id: colorId, ...color },
        createdBy,
        estimationPage: { id: estimationPageId, ...estimationPage },
        favicon,
        footer: { id: footerId, ...footer },
        introBanner: { id: introBannerId, media: introBannerMedia, ...introBanner },
        logo,
        owner,
        phone: { id: phoneId, ...phone },
        registerForm: { id: registerFormId, placeholder: { id: placeholderId, ...placeholder }, ...registerForm },
        reviews: _reviews,
        socialLinks: { id: socialLinksId, ...socialLinks },
        thankyouBanner: { id: thankyouBannerId, media: thankyouBannerMedia, ...thankyouBanner },
        thankyouPage: { id: thankyouPageId, ...thankyouPage },
        updatedBy,
        zip,
        zipRestriction: { id: zipRestrictionId, ...zipRestriction },
        ...form
      } = data;
      // check if duplicate form exists
      const newFormCreated = await strapi.entityService.findMany('api::form.form', {
        filters: {
          subDomain: form.subDomain
        },
        populate: '*'
      });
      if (newFormCreated.length) {
        return ctx.badRequest('Form already exists');
      }
      // create form
      const newFormData = {
        categoryForm,
        color,
        createdBy: createdBy.id,
        estimationPage,
        favicon: favicon.id,
        footer,
        introBanner: {
          ...introBanner,
          media: introBannerMedia ? introBannerMedia.id : null,
        },
        logo: logo.id,
        owner: owner.id,
        phone,
        registerForm: {
          ...registerForm,
          placeholder
        },
        // reviews: reviews.map(({ id, ...r }) => r),
        socialLinks,
        thankyouBanner: {
          ...thankyouBanner,
          media: thankyouBannerMedia ? thankyouBannerMedia.id : null,
        },
        thankyouPage,
        updatedBy: updatedBy.id,
        zip: zip.map(({ id, ...z }) => z),
        zipRestriction,
        ...form,
      };
      // console.log(newFormData);
      const newForm = await strapi.entityService.create('api::form.form', {
        data: newFormData,
        populate: '*',
      });
      // console.log('newForm', newForm.id);
      // create new categories
      const CATEGORY_POPULATE = {
        icon: true,
        iconActive: true,
        flows: {
          populate: {
            flow: true,
          }
        },
      };
      const newCategoryMapping = {};
      const categories = await strapi.db.query('api::form-category.form-category').findMany({
        where: {
          form: formId,
        },
        populate: CATEGORY_POPULATE,
      });
      let newCategories = await Promise.all(
        categories.map(async (category) => {
          const { id: categoryId, icon, iconActive, flows, ...categoryData } = category;
          const newCategory = await strapi.entityService.create('api::form-category.form-category', {
            data: {
              ...categoryData,
              form: newForm.id,
              icon: icon.id,
              iconActive: iconActive.id,
            },
            populate: CATEGORY_POPULATE,
          });
          newCategoryMapping[category.id] = newCategory.id;
          return {
            ...newCategory,
            flows,
          };
        })
      );
      // console.log('newCategories', newCategories.map(c => c.id));
      // console.log('newCategoryMapping', newCategoryMapping);
      // create new flows
      const FLOW_POPULATE = {
        questions: {
          populate: {
            options: {
              populate: {
                icon: true,
                iconActive: true,
                nextFlow: true,
              }
            },
            otherwiseFlow: true,
          }
        },
        category: true,
      };
      const currentFlows = await strapi.db.query("api::form-category-flow.form-category-flow").findMany({
        where: {
          form: formId
        },
        populate: FLOW_POPULATE
      });
      const newFlowMapping = {};
      let newFlows = await Promise.all(currentFlows.map(async flow => {
        const { id: flowId, questions, ...flowData } = flow;
        const newQuestions = questions.map(question => {
          const { id: questionId, options, otherwiseFlow, ...questionData } = question;
          const newOptions = options.map(option => {
            const { id: optionId, icon, iconActive, nextFlow, ...optionData } = option;
            return {
              ...optionData,
              icon: icon ? icon.id : null,
              iconActive: iconActive ? iconActive.id : null,
              nextFlow: nextFlow ? nextFlow.id : null,
            }
          })
          return {
            ...questionData,
            options: newOptions,
            otherwiseFlow: otherwiseFlow ? otherwiseFlow.id : null,
          }
        });
        const newFlow = await strapi.entityService.create('api::form-category-flow.form-category-flow', {
          data: {
            ...flowData,
            form: newForm.id,
            category: newCategoryMapping[flow.category.id],
            questions: newQuestions,
          },
          populate: FLOW_POPULATE
        });
        if (newFlow) {
          newFlowMapping[flowId] = newFlow.id;
        }
        return newFlow;
      }));
      // console.log('newFlows', newFlows.map(f => f.id));
      // console.log('newFlowMapping', newFlowMapping);
      // remap nextFlow and otherwiseFlow
      newFlows = await Promise.all(newFlows.map(async flow => {
        const { id: flowId, questions } = flow;
        const newQuestions = questions.map(question => {
          const { id: questionId, options, otherwiseFlow, ...questionData } = question;
          const newOptions = options.map(option => {
            const { id: optionId, icon, iconActive, nextFlow, ...optionData } = option;
            return {
              ...optionData,
              icon: icon ? icon.id : null,
              iconActive: iconActive ? iconActive.id : null,
              nextFlow: nextFlow ? newFlowMapping[nextFlow.id] : null,
            }
          })
          return {
            ...questionData,
            options: newOptions,
            otherwiseFlow: otherwiseFlow ? newFlowMapping[otherwiseFlow.id] : null,
          }
        });
        return strapi.entityService.update('api::form-category-flow.form-category-flow', flowId, {
          data: {
            questions: newQuestions,
          },
          populate: FLOW_POPULATE
        });
      }));
      // remap new category flows
      newCategories = await Promise.all(newCategories.map(async category => {
        const { id: categoryId, flows: flowsData } = category;
        const flows = flowsData && flowsData.length ? flowsData.map((item) => ({ flow: newFlowMapping[item.flow.id] })) : null;
        return await strapi.entityService.update('api::form-category.form-category', categoryId, {
          data: {
            flows,
          },
          populate: CATEGORY_POPULATE
        });
      }));
      // clone reviews
      const reviews = await strapi.db.query('api::form-review.form-review').findMany({
        where: {
          form: formId
        },
        populate: {
          avatar: true,
        }
      });
      const newReviews = await Promise.all(reviews.map(async review => {
        const { id: reviewId, avatar, ...reviewData } = review;
        return strapi.entityService.create('api::form-review.form-review', {
          data: {
            ...reviewData,
            form: newForm.id,
            avatar: avatar ? avatar.id : null,
          }
        });
      }));

      return ctx.send(JSON.stringify({
        newForm,
        newCategories,
        newFlows,
        newReviews,
      }));
    }
    return ctx.badRequest('Missing data');
  },
};
