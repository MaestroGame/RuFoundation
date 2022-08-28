import * as React from 'react';
import { Component } from 'react';
import Loader from "../util/loader";
import styled from "styled-components";
import WikidotModal from "../util/wikidot-modal";
import sleep from "../util/async-sleep";
import {makePreview} from "../api/preview";
import {removeMessage, showPreviewMessage} from "../util/wikidot-message"
import {createArticle, fetchArticle, updateArticle} from "../api/articles";
import {previewForumPost} from '../api/forum'


export interface ForumPostPreview {
    name: string
    description: string
    content: string
}

export interface ForumPostSubmission {
    name: string
    description: string
    source: string
}

interface Props {
    initialTitle?: string
    isThread?: boolean
    onSubmit?: (input: ForumPostSubmission) => Promise<void>
    onPreview?: (result: ForumPostPreview) => void
    onClose?: () => void
    isNew?: boolean
    postId?: number
}

interface State {
    name: string
    description: string
    source: string
    loading: boolean
    saving: boolean
    savingSuccess?: boolean
    error?: string
    fatalError?: boolean
}


const Styles = styled.div`
.w-editor-area {
  position: relative;
  
  &.loading {
    &::after {
      content: ' ';
      position: absolute;
      background: #0000003f;
      z-index: 0;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
    }
    .loader {
      position: absolute;
      left: 16px;
      top: 16px;
      z-index: 1;
    }
  }
}
`;


class ForumPostEditor extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            name: props.initialTitle || '',
            source: '',
            description: '',
            loading: true,
            saving: false
        }
    }

    async componentDidMount() {
        const { isNew, postId } = this.props;
        if (!isNew) {
            this.setState({ loading: true });
            try {
                //const data = await fetchArticle(pageId);
                //this.setState({ loading: false, source: data.source, title: data.title });
            } catch (e) {
                this.setState({ loading: false, fatalError: true, error: e.error || 'Ошибка связи с сервером' });
            }
        } else {
            this.setState({ loading: false })
        }
    }

    onSubmit = async () => {
        const { onSubmit } = this.props;
        if (onSubmit) {
            const { name, description, source } = this.state;
            const input: ForumPostSubmission = {
                name: name, description, source
            };
            this.setState({ saving: true, error: null, savingSuccess: false });
            try {
                await onSubmit(input);
                this.setState({ saving: false, error: null, savingSuccess: false });
            } catch (e) {
                this.setState({ loading: false, saving: false, fatalError: false, error: e.message || e.error || 'Ошибка связи с сервером' });
            }
        }
    };

    onPreview = async () => {
        const { onPreview } = this.props;
        if (onPreview) {
            const {name, description, source} = this.state;
            const {result: rendered} = await previewForumPost(source);
            const input: ForumPostPreview = {
                name: name, description,
                content: rendered
            }
            onPreview(input);
        }
    };

    onCancel = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const { onClose } = this.props;
        if (onClose) {
            onClose();
        }
    };

    onChange = (e) => {
        // @ts-ignore
        this.setState({[e.target.name]: e.target.value})
    };

    onCloseError = () => {
        const { fatalError } = this.state;
        this.setState({error: null});
        if (fatalError) {
            this.onCancel(null);
        }
    };

    render() {
        const { isNew, isThread } = this.props;
        const { name, source, description, loading, saving, savingSuccess, error } = this.state;

        // todo: check if this ID is actually used anywhere. if not, we can drop it
        let formId = 'edit-post-form';
        if (isNew && isThread) {
            formId = 'new-thread-form';
        } else if (isNew) {
            formId = 'new-post-form';
        }

        return (
            <Styles>
                { saving && <WikidotModal isLoading>Сохранение...</WikidotModal> }
                { savingSuccess && <WikidotModal>Успешно сохранено!</WikidotModal> }
                { error && (
                    <WikidotModal buttons={[{title: 'Закрыть', onClick: this.onCloseError}]}>
                        <strong>Ошибка:</strong> {error}
                    </WikidotModal>
                ) }
                <form id={formId} onSubmit={this.onSubmit}>
                    <table className="form" style={{ margin: '1em 0' }}>
                        <tbody>
                        <tr>
                            <td>Заголовок {isThread?'темы':'сообщения'}:</td>
                            <td>
                                <input className="text form-control" value={name} onChange={this.onChange} name="name" type="text" size={35} maxLength={128} style={{ fontWeight: 'bold', fontSize: '130%' }} disabled={loading||saving} />
                            </td>
                        </tr>
                        {isThread && <tr>
                            <td>Короткое описание темы:</td>
                            <td>
                                <textarea cols={40} rows={2} className="form-control" value={description} onChange={this.onChange} name="description" maxLength={1000} disabled={loading||saving} />
                            </td>
                        </tr> }
                        </tbody>
                    </table>
                    {/* This is not supported right now but we have to add empty div for BHL */}
                    <div id="wd-editor-toolbar-panel" className="wd-editor-toolbar-panel" />
                    <div className={`w-editor-area ${loading?'loading':''}`}>
                        <textarea className="form-control" value={source} onChange={this.onChange} name="source" rows={10} cols={60} style={{ width: '95%' }} disabled={loading||saving} />
                        { loading && <Loader className="loader" /> }
                    </div>
                    <div className="buttons alignleft">
                        <input id="edit-cancel-button" className="btn btn-danger" type="button" name="cancel" value="Отмена" onClick={this.onCancel} disabled={loading||saving} />
                        <input id="edit-preview-button" className="btn btn-primary" type="button" name="preview" value="Предпросмотр" onClick={this.onPreview} disabled={loading||saving} />
                        <input id="edit-save-button" className="btn btn-primary" type="button" name="save" value="Отправить" onClick={this.onSubmit} disabled={loading||saving} />
                    </div>
                </form>
            </Styles>
        )
    }
}


export default ForumPostEditor