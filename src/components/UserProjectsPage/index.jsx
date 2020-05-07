import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import './UserProjectsPage.css';
import addProject, { clearAddProjectState } from '../../redux/actions/addProject';
import InformationBar from '../InformationBar';
import Header from '../Header';
import PrimaryButton from '../PrimaryButton';
import Modal from '../Modal';
import getClustersList from '../../redux/actions/clusters';
import getUserProjects from '../../redux/actions/projectsList';
import BlackInputText from '../BlackInputText';
import TextArea from '../TextArea';
import ProjectCard from '../ProjectCard';
import Spinner, { BigSpinner } from '../SpinnerComponent';
import crane from '../../assets/images/plant.svg';
import Feedback from '../Feedback';
import Select from '../Select';


class UserProjectsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      projectName: '',
      clusterID: '',
      projectDescription: '',
      error: ''
    };

    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateProjectName = this.validateProjectName.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentDidMount() {
    const { getClustersList, getUserProjects, data } = this.props;
    getUserProjects(data.id);
    getClustersList();
  }

  componentDidUpdate(prevProps) {
    const {
      isAdded, getClustersList, getUserProjects, data, isDeleted, isUpdated
    } = this.props;

    if (isDeleted !== prevProps.isDeleted) {
      getUserProjects(data.id);
      getClustersList();
    }

    if (isUpdated !== prevProps.isUpdated) {
      getUserProjects(data.id);
      getClustersList();
    }

    if (isAdded !== prevProps.isAdded) {
      getUserProjects(data.id);
      this.hideForm();
    }
  }

  showForm() {
    this.setState({ openModal: true });
  }

  hideForm() {
    const { clearAddProjectState } = this.props;
    clearAddProjectState();
    this.setState({ openModal: false });
  }

  validateProjectName(name) {
    if (/^[a-z]/i.test(name)) {
      if (name.match(/[^-a-zA-Z]/)) {
        return 'false_convention';
      }
      return true;
    }
    return false;
  }

  handleChange(e) {
    const { error } = this.state;
    this.setState({
      [e.target.name]: e.target.value
    });

    if (error) {
      this.setState({
        error: ''
      });
    }
  }

  handleSelectChange(selected) {
    this.setState({ clusterID: selected.id });
  }

  handleSubmit() {
    const { projectName, projectDescription, clusterID } = this.state;
    const { addProject, data } = this.props;

    if (!projectName || !clusterID || !projectDescription) {
      // if user tries to submit empty email/password
      this.setState({
        error: 'all fields are required'
      });
    } else if (this.validateProjectName(projectName) === false) {
      this.setState({
        error: 'name should start with a letter'
      });
    } else if (this.validateProjectName(projectName) === 'false_convention') {
      this.setState({
        error: 'name may only contain letters and a hypen -'
      });
    } else {
      const newProject = {
        description: projectDescription,
        cluster_id: clusterID,
        name: projectName,
        owner_id: data.id
      };
      addProject(newProject);
    }
  }


  render() {
    const {
      openModal,
      projectName,
      projectDescription,
      error,
    } = this.state;
    const {
      projects,
      clusters,
      isRetrieving,
      // data,
      message,
      errorCode,
      isFetched,
      isAdded,
      isAdding
    } = this.props;

    return (
      <div className="Page">
        <div className="TopRow">
          <Header />
          <InformationBar header="Projects" showBtn btnAction={this.showForm} />
        </div>
        <div className="MainRow">
          <div className="ProjectList">
            {
              isRetrieving ? (
                <div className="TableLoading">
                  <div className="SpinnerWrapper">
                    <BigSpinner />
                  </div>
                </div>
              ) : (
                <div className="ProjectList">
                  {(isFetched && projects !== undefined && (
                    (projects.map((project) => (
                      <div key={project.id} className="ProjectCardItem">
                        <ProjectCard
                          name={project.name}
                          description={project.description}
                          CardID={project.id}
                          icon={crane}
                        />
                      </div>
                    ))))
                  )}
                  {(isFetched && projects.length === 0) && (
                    <div className="NoContentDiv">
                      You haven’t created any projects yet.
                      Click the create button to get started.
                    </div>
                  )}
                  {(!isRetrieving && !isFetched) && (
                    <div className="NoContentDiv">
                      Oops! Something went wrong!
                      Failed to retrieve Projects.
                    </div>
                  )}

                </div>
              )
            }
          </div>
        </div>
        <div className="FooterRow">
          <p>
            Copyright © 2020 Crane Cloud.
            <br />
            All Rights Reserved.
          </p>
        </div>

        {/* Modal for creating a new project
        Its triggered by the value of state.openModal */}
        <Modal showModal={openModal}>
          <div className="ModalForm">
            <div className="ModalFormHeading">
              <h2>Add a project</h2>
            </div>
            <div className="ModalFormInputs">
              <Select
                required
                placeholder="Select a cluster"
                options={clusters}
                onChange={this.handleSelectChange}
              />

              <BlackInputText
                required
                placeholder="Project Name"
                name="projectName"
                value={projectName}
                onChange={(e) => {
                  this.handleChange(e);
                }}
              />

              <TextArea
                placeholder="Project Description"
                name="projectDescription"
                value={projectDescription}
                onChange={(e) => {
                  this.handleChange(e);
                }}
              />

            </div>
            {error && (
              <Feedback
                type="error"
                message={error}
              />
            )}
            <div className="ModalFormButtons">
              <PrimaryButton label="Cancel" className="CancelBtn" onClick={this.hideForm} />
              <PrimaryButton label={isAdding ? <Spinner /> : 'Create project'} onClick={this.handleSubmit} />
            </div>

            {message && (
              <Feedback
                message={errorCode === 409 ? 'Name already in use, please choose another' : message}
                type={(isAdded && errorCode !== 409) ? 'success' : 'error'}
              />
            )}

          </div>
        </Modal>
      </div>
    );
  }
}

UserProjectsPage.propTypes = {
  projects: PropTypes.arrayOf(PropTypes.object),
  clusters: PropTypes.arrayOf(PropTypes.object),
  getClustersList: PropTypes.func.isRequired,
  getUserProjects: PropTypes.func.isRequired,
  clearAddProjectState: PropTypes.func.isRequired,
  addProject: PropTypes.func.isRequired,
  data: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  isAdded: PropTypes.bool,
  errorCode: PropTypes.number,
  isAdding: PropTypes.bool,
  isFetched: PropTypes.bool,
  message: PropTypes.string,
  isUpdated: PropTypes.bool,
  isDeleted: PropTypes.bool,
  isRetrieving: PropTypes.bool
};

UserProjectsPage.defaultProps = {
  clusters: [],
  isAdded: false,
  isAdding: false,
  errorCode: null,
  projects: [],
  message: '',
  isFetched: false,
  isUpdated: false,
  isDeleted: false,
  isRetrieving: false
};

const mapStateToProps = (state) => {
  const { data } = state.user;
  const {
    isAdded, isAdding, message, errorCode
  } = state.addProjectReducer;
  const { clusters } = state.clustersReducer;
  const { isDeleted } = state.deleteProjectReducer;
  const { isRetrieving, projects, isFetched } = state.userProjectsReducer;
  const { isUpdated } = state.updateProjectReducer;
  return {
    isAdded,
    data,
    isRetrieving,
    projects,
    clusters,
    isUpdated,
    isFetched,
    isAdding,
    message,
    isDeleted,
    errorCode
  };
};

const mapDispatchToProps = {
  getUserProjects, addProject, getClustersList, clearAddProjectState
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProjectsPage);
