'use strict';

/**
 *  shortner controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::shortner.shortner', ({ strapi }) => ({
    async find(ctx) {
        let { query } = ctx;

        const user = ctx.state.user;
        let entity;
        if (user) {
            query = { user: { '$eq': user.id } }
            entity = await strapi.service('api::shortner.shortner').find({ filters: query });

        } else {
            query = { alias: { '$eq': query.alias } }
            entity = await strapi.service('api::shortner.shortner').find({ filters: query });
            if (entity.results.length !== 0) {
                let id = entity.results[0].id
                let visit = Number(entity.results[0].visit) + 1
                await strapi.service('api::shortner.shortner').update(id, { data: { visit } });
            }
        }
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

        return this.transformResponse(sanitizedEntity);
    },

    async create(ctx) {
        const { data } = ctx.request.body;
        const user = ctx.state.user;
        let entity;
        data.user = user.id
        entity = await strapi.service('api::shortner.shortner').create({ data });

        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

        return this.transformResponse(sanitizedEntity);
    },

    async delete(ctx) {
        let { id } = ctx.params;
        const user = ctx.state.user;
        let entity;

        let query = { user: { '$eq': user.id }, id: { '$eq': id } }

        entity = await strapi.service('api::shortner.shortner').find({ filters: query });
        if (entity.results.length === 0) {
            return ctx.badRequest(null, [{ messages: [{ id: 'You can delete someone else content' }] }]);
        }

        entity = await strapi.service('api::shortner.shortner').delete(id);
        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

        return this.transformResponse(sanitizedEntity);
    },

}));

