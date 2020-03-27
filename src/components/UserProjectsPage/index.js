import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import './UserProjectsPage.css';
import InformationBarSub from '../InformationBarSub';
import Header from '../Header';
import AddProject from '../../redux/actions/addProject';
import Modal from '../Modal';
import PrimaryButton from '../PrimaryButton';
import InputText from '../InputText';
import ProjectsList from '../ProjectsList';
import availableClusters from '../../helpers/allClusters.js';


const todaysDate = new Date();

class UserProjectsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false, // add project modal is closed initially
      projectName: '',
      cluster_ID: '',
      clusters: [],
    };

    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios.get(`${API_BASE_URL}/clusters`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then((res) => {
      this.setState({
        clusters: res.data.clusters
      });
      console.log('hello', this.state.clusters);
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit() {
    const project = {
      projectName: this.state.projectName,
      alias: this.state.projectName + todaysDate.toISOString(),
      cluster_ID: this.state.cluster_ID,
      owner_ID: this.state.data.id
    };

    this.setState({
      loading: true
    });
  }

  showForm() {
    this.setState({ openModal: true });
  }

  hideForm() {
    this.setState({ openModal: false });
  }

  render() {
    const { project, isAdded, data } = this.props;
    const {
      openModal,
      projectName,
      cluster_ID,
      loading
    } = this.state;
    const userId = data.id;
    return (
      <div className="Page">
        <div className="TopRow">
          <Header />
          <InformationBarSub header="Projects" showBtn btnAction={this.showForm} />
        </div>
        <div className="MainRow">
          <ProjectsList />
          <div className="FooterRow">
            <p>
              Copyright © 2020 Crane Cloud.
              All Rights Reserved.
            </p>
          </div>
        </div>

        {/* Modal for creating a new project
        Its triggered by the value of state.openModal */}
        <Modal showModal={openModal}>
          <div className="ModalForm">
            <div className="ModalFormHeading">
              <h2>Add a project</h2>
            </div>
            <div className="ModalFormInputs">
              <select required>
                <option value="" disabled selected>Pick a Cluster</option>
                <option value="lime">Lime</option>
                <option value="coconut">Coconut</option>
              </select>
              <InputText
                placeholder="Project Name"
                name="projectName"
                value={projectName}
                onChange={(e) => {
                  this.handleChange(e);
                }}
              />
            </div>
            <div className="ModalFormButtons">
              <PrimaryButton label="Create project" />
              <PrimaryButton label="Cancel" className="CancelBtn" onClick={this.hideForm} />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

UserProjectsPage.propTypes = {
  project: PropTypes.arrayOf(PropTypes.object),
  isAdded: PropTypes.bool
};

UserProjectsPage.defaultProps = {
  project: [],
  isAdded: false
};

export const mapStateToProps = (state) => {
  const { isAdded, project } = state.addProjectReducer;
  const { data } = state.user;
  return { isAdded, project, data };
};

export const mapDispatchToProps = (dispatch) => bindActionCreators({
  AddProject
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProjectsPage);
