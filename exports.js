export const ACCEPTED_FILES = '.gif,.jpg,.jpeg,.png,.pdf,.doc,.docx,.zip,.rar,.pages,.abw,.odt,.ps,.txt,.md';
export const ACCEPTED_IMAGES = '.gif,.jpg,.jpeg,.png';
export const DEFAULT_FILESIZE = 2;

/**
 * Return part of Simple Schema, which is prefigured for avatars
 * @param params {{name, optional, maxFilesize, acceptedFiles, isRemovable}}
 * @returns {{type: *, autoform: {type: string, data: *}, optional}}
 */
export function getAvatarSchemaField (params) {
    let defaultName = 'avatar';
    if (typeof params === 'string') {
        defaultName = params;
        params = {};
    }
    let {optional = false, name = defaultName, ...data} = params || {};
    data = data || {};
    Object.assign(data, {
        acceptedFiles: ACCEPTED_IMAGES,
        maxFilesize: DEFAULT_FILESIZE
    });
    return {
        [name]: {
            type: Object,
            autoform: {
                type: 'universe-avatar',
                data
            },
            optional
        },
        [`${name}._id`]: {
            type: String
        },
        [`${name}.path`]: {
            type: String
        },
        [`${name}.orgName`]: {
            type: String,
            optional: true
        }
    };
}
/**
 * Return part of Simple Schema, which is prefigured for file/files
 * @param params {{name, isImage, optional, isMulti, maxFilesize, acceptedFiles}}
 * @returns {{type: *, autoform: {type: string, data: *}, optional}}
 */
export function getFileSchemaField (params) {
    let defaultName = 'file';
    if (typeof params === 'string') {
        defaultName = params;
        params = {};
    }
    let {optional = false, isMulti = false, name = defaultName, ...data} = params || {};
    data = data || {};
    Object.assign(data, {
        acceptedFiles: params.isImage? ACCEPTED_IMAGES : ACCEPTED_FILES,
        maxFilesize: DEFAULT_FILESIZE
    });

    if (isMulti) {
        return {
            [name]: {
                type: [Object],
                autoform: {
                    type: 'universe-upload-button',
                    data
                },
                optional
            },
            [`${name}.$._id`]: {
                type: String
            },
            [`${name}.$.path`]: {
                type: String
            },
            [`${name}.$.orgName`]: {
                type: String,
                optional: true
            }
        };
    }

    return {
        [name]: {
            type: Object,
            autoform: {
                type: 'universe-upload-button',
                data
            },
            optional
        },
        [`${name}._id`]: {
            type: String
        },
        [`${name}.path`]: {
            type: String
        },
        [`${name}.orgName`]: {
            type: String,
            optional: true
        }
    };
}
